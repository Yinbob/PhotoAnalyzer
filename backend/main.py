"""
PhotoLens Analyzer - FastAPI Backend
Serves the frontend and provides EXIF analysis API.
"""
import os
import hashlib
import json
import tempfile
from pathlib import Path
from datetime import datetime
from collections import Counter
from typing import Any, List, Optional

from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Form, Query, Request
from fastapi import Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.exif_engine import ExifEngine, IMAGE_EXTENSIONS
from backend.auth import AuthManager
import backend.database as db

app = FastAPI(title="PhotoLens Analyzer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
CAMERA_DATA_PATH = Path(__file__).resolve().parent / "camera_data.json"

engine = ExifEngine(str(CAMERA_DATA_PATH))
auth = AuthManager()

db.init_db()


class PasswordRequest(BaseModel):
    password: str
    new_password: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class CollectionRequest(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None


class BulkCollectionsRequest(BaseModel):
    photo_ids: List[int]
    add_collection_ids: List[int] = []
    remove_collection_ids: List[int] = []


class BulkPhotoRequest(BaseModel):
    photo_ids: List[int]


class PurgeRequest(BaseModel):
    confirm: str


class BatchCollectionRequest(BaseModel):
    name: str
    description: Optional[str] = None


def require_authenticated(request: Request):
    session = auth.current_session(request)
    if session is None:
        raise HTTPException(
            status_code=401,
            detail="Data management requires login.",
        )
    return session


@app.get("/")
async def index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/api/analyze")
async def analyze_photos(
    request: Request,
    files: List[UploadFile] = File(...),
    collection_id: Optional[int] = Form(None),
):
    """Analyze uploaded photo files and return EXIF statistics."""
    results = []
    errors = []
    saved_count = 0
    duplicate_count = 0
    unsupported_count = 0
    database_error = None
    target_collection = None
    authenticated = auth.is_authenticated(request)
    try:
        batch_id = db.create_batch(len(files))
    except Exception as exc:
        batch_id = None
        database_error = str(exc)

    if authenticated and collection_id is not None:
        try:
            target_collection = db.get_collection(collection_id)
        except Exception:
            target_collection = None

    with tempfile.TemporaryDirectory() as tmpdir:
        for upload in files:
            # Skip macOS resource fork files
            if (upload.filename or "").startswith("._"):
                continue

            # Use only basename to prevent path traversal from folder uploads
            safe_name = Path(upload.filename or "").name
            ext = Path(safe_name).suffix.lower()
            if ext not in IMAGE_EXTENSIONS:
                errors.append(f"Unsupported format: {upload.filename}")
                unsupported_count += 1
                continue

            file_path = os.path.join(tmpdir, safe_name)
            # Handle duplicate filenames in flat tmpdir
            if os.path.exists(file_path):
                base, suffix = os.path.splitext(safe_name)
                counter = 1
                while os.path.exists(file_path):
                    file_path = os.path.join(tmpdir, f"{base}_{counter}{suffix}")
                    counter += 1

            content = await upload.read()
            content_hash = hashlib.sha256(content).hexdigest()
            with open(file_path, "wb") as f:
                f.write(content)

            data = engine.extract_single(file_path)
            if data is None:
                errors.append(f"No EXIF data: {upload.filename}")
            elif "error" in data:
                errors.append(f"{upload.filename}: {data['error']}")
            else:
                results.append(data)
                if batch_id is None:
                    continue
                try:
                    photo_id, inserted = db.save_photo(
                        data, content_hash, len(content), batch_id
                    )
                    if inserted:
                        saved_count += 1
                    else:
                        duplicate_count += 1
                    if target_collection:
                        db.add_photo_to_collection(photo_id, target_collection["id"])
                except Exception as exc:
                    database_error = str(exc)
                    errors.append(f"Could not save EXIF data: {upload.filename}")

    if batch_id is not None:
        try:
            db.update_batch(
                batch_id,
                parsed_count=len(results),
                saved_count=saved_count,
                duplicate_count=duplicate_count,
                unsupported_count=unsupported_count,
                error_count=len(errors),
            )
        except Exception as exc:
            database_error = str(exc)

    stats = compute_stats(results)
    return JSONResponse({
        "photos": results,
        "stats": stats,
        "errors": errors,
        "total_processed": len(results),
        "total_errors": len(errors),
        "persistence": {
            "batch_id": batch_id,
            "saved_count": saved_count,
            "duplicate_count": duplicate_count,
            "unsupported_count": unsupported_count,
            "collection_id": target_collection["id"] if target_collection else None,
            "db_error": database_error,
        },
    })


def compute_stats(photos: list) -> dict:
    if not photos:
        return {}

    total = len(photos)

    # Focal length group distribution
    focal_groups = Counter(p.get("focal_group", "unknown") for p in photos)
    # Sort by group order
    ordered_groups = {}
    for key in ["ultra_wide", "ultra_wide_20", "wide", "standard_wide", "normal",
                 "portrait", "medium_tele", "tele",
                 "super_tele_300", "super_tele_400", "super_tele_500", "super_tele_600"]:
        for group_name, count in focal_groups.items():
            # Match by exact group key or partial string
            if group_name == key or any(kw in group_name for kw in [key.replace("_", " ")]):
                ordered_groups[group_name] = count
                break
    # Add remaining
    for g, c in focal_groups.items():
        if g not in ordered_groups:
            ordered_groups[g] = c

    # Specific focal length distribution
    focal_lengths = [p["equiv_focal"] for p in photos if p.get("equiv_focal")]
    focal_dist = Counter(round(fl, 1) for fl in focal_lengths)
    focal_dist_sorted = dict(sorted(focal_dist.items(), key=lambda x: x[0]))

    # Aperture distribution
    apertures = [p["aperture"] for p in photos if p.get("aperture")]
    aperture_dist = Counter(f"f/{a}" for a in apertures)
    aperture_dist_sorted = dict(sorted(aperture_dist.items(),
                                        key=lambda x: float(x[0].replace("f/", ""))))

    # ISO distribution
    isos = [p["iso"] for p in photos if p.get("iso")]
    iso_dist = Counter(isos)
    iso_dist_sorted = dict(sorted(iso_dist.items()))

    # Camera usage
    cameras = Counter(p.get("camera_model", "Unknown") for p in photos)
    cameras_sorted = dict(cameras.most_common())

    # Lens usage
    lenses = Counter(p.get("lens_model", "Unknown") for p in photos
                     if p.get("lens_model") and p["lens_model"] != "Unknown")
    lenses_sorted = dict(lenses.most_common())

    # Monthly timeline
    monthly = Counter()
    for p in photos:
        date_str = p.get("date", "")
        if date_str and len(date_str) >= 7:
            month = date_str[:7]  # YYYY-MM
            monthly[month] += 1
    monthly_sorted = dict(sorted(monthly.items()))

    # Daily hour distribution
    hourly = Counter()
    for p in photos:
        date_str = p.get("date", "")
        if date_str and len(date_str) >= 13:
            try:
                hour = int(date_str[11:13])
                hourly[hour] += 1
            except (ValueError, IndexError):
                pass
    hourly_sorted = {h: hourly.get(h, 0) for h in range(24)}

    # Day of week
    dow_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    dow = Counter()
    for p in photos:
        date_str = p.get("date", "")
        if date_str:
            try:
                dt = datetime.fromisoformat(date_str[:19])
                dow[dow_names[dt.weekday()]] += 1
            except (ValueError, TypeError):
                pass
    dow_sorted = {d: dow.get(d, 0) for d in dow_names}

    # Lens recommendations
    recommendations = generate_recommendations(focal_dist, focal_groups, total)

    # Format distribution
    formats = Counter(p.get("format", "Unknown") for p in photos)

    # Average stats
    avg_focal = round(sum(focal_lengths) / len(focal_lengths), 1) if focal_lengths else 0
    avg_aperture = round(sum(apertures) / len(apertures), 1) if apertures else 0
    avg_iso = round(sum(isos) / len(isos), 0) if isos else 0
    median_iso = sorted(isos)[len(isos) // 2] if isos else 0

    return {
        "total": total,
        "focal_groups": ordered_groups,
        "focal_dist": focal_dist_sorted,
        "aperture_dist": aperture_dist_sorted,
        "iso_dist": iso_dist_sorted,
        "cameras": cameras_sorted,
        "lenses": lenses_sorted,
        "monthly": monthly_sorted,
        "hourly": hourly_sorted,
        "dow": dow_sorted,
        "formats": dict(formats),
        "recommendations": recommendations,
        "averages": {
            "focal_length": avg_focal,
            "aperture": avg_aperture,
            "iso": avg_iso,
            "median_iso": median_iso,
        },
        "focal_groups_definition": engine.focal_groups,
    }


def generate_recommendations(focal_dist, focal_groups, total) -> list:
    recs = []
    if not focal_dist:
        return recs

    sorted_focals = sorted(focal_dist.items(), key=lambda x: -x[1])
    top_focal = sorted_focals[0]
    top_pct = round(top_focal[1] / total * 100, 1)

    recs.append({
        "type": "primary_lens",
        "title": "最常用焦段",
        "detail": f"{top_focal[0]}mm 占 {top_pct}% 的拍摄量",
        "suggestion": f"考虑升级 {top_focal[0]}mm 焦段范围的镜头以获得更好画质",
    })

    # Check if user heavily uses one focal range
    group_counter = Counter()
    for focal, count in focal_dist.items():
        for key, grp in engine.focal_groups.items():
            if grp["min"] <= focal <= grp["max"]:
                group_counter[grp["label"]] += count
                break

    if group_counter:
        top_group = group_counter.most_common(1)[0]
        top_group_pct = round(top_group[1] / total * 100, 1)
        if top_group_pct > 50:
            recs.append({
                "type": "focus_range",
                "title": "焦段集中度",
                "detail": f"{top_group[0]} 占 {top_group_pct}%，焦段使用非常集中",
                "suggestion": f"您对 {top_group[0]} 范围的镜头需求很高，建议投资一支该范围的高端镜头",
            })

    # Wide vs tele balance
    wide_count = sum(c for f, c in focal_dist.items() if f <= 35)
    tele_count = sum(c for f, c in focal_dist.items() if f >= 85)
    mid_count = total - wide_count - tele_count

    if wide_count > total * 0.6:
        recs.append({
            "type": "style",
            "title": "广角偏好",
            "detail": f"广角焦段（≤35mm）占 {round(wide_count / total * 100, 1)}%",
            "suggestion": "您偏好广角拍摄，考虑升级超广角镜头或广角变焦镜头",
        })
    elif tele_count > total * 0.6:
        recs.append({
            "type": "style",
            "title": "长焦偏好",
            "detail": f"长焦焦段（≥85mm）占 {round(tele_count / total * 100, 1)}%",
            "suggestion": "您偏好长焦拍摄，考虑升级大光圈长焦镜头",
        })

    return recs


@app.post("/api/export-csv")
async def export_csv(files: List[UploadFile] = File(...)):
    """Re-analyze photos and return CSV data."""
    import csv, io
    results = []
    with tempfile.TemporaryDirectory() as tmpdir:
        for upload in files:
            if (upload.filename or "").startswith("._"):
                continue
            safe_name = Path(upload.filename or "").name
            ext = Path(safe_name).suffix.lower()
            if ext not in IMAGE_EXTENSIONS:
                continue
            file_path = os.path.join(tmpdir, safe_name)
            content_bytes = await upload.read()
            with open(file_path, "wb") as f:
                f.write(content_bytes)
            data = engine.extract_single(file_path)
            if data and "error" not in data:
                results.append(data)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Filename", "Camera", "Lens", "Focal Length", "35mm Equivalent",
                     "Focal Group", "Aperture", "ISO", "Shutter Speed", "Date", "Format"])
    for p in results:
        shutter = ""
        if p.get("exposure_time"):
            et = p["exposure_time"]
            shutter = f"1/{round(1/et)}s" if et < 1 else f"{et}s"
        writer.writerow([
            p.get("filename", ""),
            p.get("camera_model", ""),
            p.get("lens_model", ""),
            p.get("focal_length", ""),
            p.get("equiv_focal", ""),
            p.get("focal_group", ""),
            f"f/{p['aperture']}" if p.get("aperture") else "",
            p.get("iso", ""),
            shutter,
            p.get("date", ""),
            p.get("format", ""),
        ])

    return JSONResponse({
        "csv": output.getvalue(),
        "filename": "photoanalysis_export.csv"
    })


@app.get("/api/auth/status")
async def auth_status(request: Request):
    return {
        "configured": auth.configured,
        "authenticated": auth.is_authenticated(request),
    }


@app.post("/api/auth/setup")
async def setup_password(payload: PasswordRequest, response: Response):
    auth.setup_password(payload.password)
    auth.login(payload.password, response)
    return {"configured": True, "authenticated": True}


@app.post("/api/auth/login")
async def login(payload: PasswordRequest, response: Response):
    auth.login(payload.password, response)
    return {"authenticated": True}


@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    auth.logout(request.cookies.get("photolens_session"), response)
    return {"authenticated": False}


@app.post("/api/auth/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    response: Response,
    _session: Any = Depends(require_authenticated),
):
    auth.change_password(
        payload.current_password, payload.new_password, request, response
    )
    return {"authenticated": True}


@app.get("/api/collections")
async def get_collections(_session: Any = Depends(require_authenticated)):
    return {"collections": db.list_collections()}


@app.post("/api/collections")
async def post_collection(
    payload: CollectionRequest,
    _session: Any = Depends(require_authenticated),
):
    try:
        collection = db.create_collection(payload.name, payload.description, payload.color)
    except Exception as exc:
        if "UNIQUE" in str(exc):
            raise HTTPException(status_code=409, detail="A collection with this name already exists.")
        raise HTTPException(status_code=400, detail="Could not create collection.")
    return collection


@app.patch("/api/collections/{collection_id}")
async def patch_collection(
    collection_id: int,
    payload: CollectionRequest,
    _session: Any = Depends(require_authenticated),
):
    if not db.get_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found.")
    updates = {
        "name": payload.name.strip(),
        "description": payload.description,
        "color": payload.color,
    }
    try:
        collection = db.update_collection(collection_id, updates)
    except Exception as exc:
        if "UNIQUE" in str(exc):
            raise HTTPException(status_code=409, detail="A collection with this name already exists.")
        raise HTTPException(status_code=400, detail="Could not update collection.")
    return collection


@app.delete("/api/collections/{collection_id}")
async def delete_collection(
    collection_id: int,
    _session: Any = Depends(require_authenticated),
):
    if not db.delete_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found.")
    return {"deleted": True}


@app.post("/api/collections/{collection_id}/photos")
async def add_collection_photos(
    collection_id: int,
    payload: BulkPhotoRequest,
    _session: Any = Depends(require_authenticated),
):
    if not db.get_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found.")
    added = sum(
        1 for photo_id in payload.photo_ids
        if db.add_photo_to_collection(photo_id, collection_id)
    )
    return {"added": added}


@app.post("/api/collections/{collection_id}/photos/remove")
async def remove_collection_photos(
    collection_id: int,
    payload: BulkPhotoRequest,
    _session: Any = Depends(require_authenticated),
):
    if not db.get_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found.")
    removed = sum(
        1 for photo_id in payload.photo_ids
        if db.remove_photo_from_collection(photo_id, collection_id)
    )
    return {"removed": removed}


@app.get("/api/photos/options")
async def photo_options(_session: Any = Depends(require_authenticated)):
    return {
        "cameras": db.photo_options("camera_model"),
        "lenses": db.photo_options("lens_model"),
        "formats": db.photo_options("format"),
    }


@app.get("/api/photos/summary")
async def photo_summary(_session: Any = Depends(require_authenticated)):
    return db.app_summary()


@app.get("/api/photos")
async def get_photos(
    collection_id: Any = "all",
    q: str = Query(""),
    camera: str = Query(""),
    lens: str = Query(""),
    format: str = Query(""),
    date_from: str = Query(""),
    date_to: str = Query(""),
    deleted: bool = False,
    sort: str = Query("captured_at"),
    order: str = Query("desc"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    _session: Any = Depends(require_authenticated),
):
    return db.list_photos(
        collection_id=collection_id,
        query=q,
        camera=camera,
        lens=lens,
        file_format=format,
        date_from=date_from,
        date_to=date_to,
        deleted=deleted,
        sort=sort,
        order=order,
        limit=limit,
        offset=offset,
    )


@app.get("/api/photos/{photo_id}")
async def get_photo_detail(
    photo_id: int,
    _session: Any = Depends(require_authenticated),
):
    photo = db.get_photo(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found.")
    photo["date"] = photo.get("captured_at") or photo.get("date_original_raw")
    return photo


@app.patch("/api/photos/{photo_id}")
async def patch_photo(
    photo_id: int,
    payload: dict[str, Any],
    _session: Any = Depends(require_authenticated),
):
    current = db.get_photo(photo_id)
    if not current:
        raise HTTPException(status_code=404, detail="Photo not found.")

    allowed_text = {"filename", "camera_model", "lens_model", "format"}
    allowed_numbers = {
        "focal_length", "focal_35mm", "aperture", "iso", "exposure_time"
    }
    updates: dict[str, Any] = {}
    for key, value in payload.items():
        if key in allowed_text:
            updates[key] = str(value).strip()
            if key == "format":
                updates[key] = updates[key].upper()
        elif key in allowed_numbers:
            try:
                number = float(value) if value not in (None, "") else None
            except (TypeError, ValueError):
                raise HTTPException(status_code=400, detail=f"{key} must be numeric.")
            if key == "iso":
                updates[key] = int(number) if number is not None else None
            else:
                updates[key] = number
        elif key == "captured_at":
            if value in (None, ""):
                updates[key] = None
            else:
                parsed = db.parse_exif_date(value)
                if not parsed:
                    raise HTTPException(status_code=400, detail="Invalid captured date.")
                updates[key] = parsed

    if any(key in updates for key in ("focal_length", "focal_35mm", "camera_model")):
        focal_length = updates.get("focal_length", current.get("focal_length"))
        focal_35mm = updates.get("focal_35mm", current.get("focal_35mm"))
        camera_model = updates.get("camera_model", current.get("camera_model"))
        if focal_35mm and focal_35mm > 0:
            equiv_focal = focal_35mm
        elif focal_length and focal_length > 0:
            crop = engine.get_crop_factor(camera_model or "")
            equiv_focal = round(focal_length * crop, 1)
        else:
            equiv_focal = None
        updates["equiv_focal"] = equiv_focal
        updates["focal_group"] = (
            engine.get_focal_group(equiv_focal) if equiv_focal else "unknown"
        )

    photo = db.update_photo(photo_id, updates)
    photo["date"] = photo.get("captured_at") or photo.get("date_original_raw")
    return photo


@app.delete("/api/photos/{photo_id}")
async def delete_photo(
    photo_id: int,
    _session: Any = Depends(require_authenticated),
):
    count = db.set_photo_deleted([photo_id], True)
    if count == 0:
        raise HTTPException(status_code=404, detail="Photo not found.")
    return {"deleted": count}


@app.post("/api/photos/bulk-delete")
async def bulk_delete_photos(
    payload: BulkPhotoRequest,
    _session: Any = Depends(require_authenticated),
):
    return {"deleted": db.set_photo_deleted(payload.photo_ids, True)}


@app.post("/api/photos/bulk-restore")
async def bulk_restore_photos(
    payload: BulkPhotoRequest,
    _session: Any = Depends(require_authenticated),
):
    return {"restored": db.set_photo_deleted(payload.photo_ids, False)}


@app.post("/api/photos/bulk-collections")
async def bulk_collections(
    payload: BulkCollectionsRequest,
    _session: Any = Depends(require_authenticated),
):
    added = 0
    removed = 0
    for collection_id in payload.add_collection_ids:
        if not db.get_collection(collection_id):
            raise HTTPException(status_code=404, detail="Collection not found.")
        added += sum(
            1 for photo_id in payload.photo_ids
            if db.add_photo_to_collection(photo_id, collection_id)
        )
    for collection_id in payload.remove_collection_ids:
        if not db.get_collection(collection_id):
            raise HTTPException(status_code=404, detail="Collection not found.")
        removed += sum(
            1 for photo_id in payload.photo_ids
            if db.remove_photo_from_collection(photo_id, collection_id)
        )
    return {"added": added, "removed": removed}


@app.post("/api/photos/purge")
async def purge_photos(
    payload: PurgeRequest,
    _session: Any = Depends(require_authenticated),
):
    if payload.confirm != "DELETE":
        raise HTTPException(status_code=400, detail="Type DELETE to confirm.")
    return {"purged": db.purge_deleted()}


@app.get("/api/history/stats")
async def history_stats(
    scope: str = Query("all"),
    collection_id: Any = Query(None),
    _session: Any = Depends(require_authenticated),
):
    photos = db.photos_for_stats(scope, collection_id)
    return {
        "scope": scope,
        "collection_id": collection_id,
        "total": len(photos),
        "stats": compute_stats(photos),
    }


@app.get("/api/batches")
async def get_batches(_session: Any = Depends(require_authenticated)):
    return {"batches": db.list_batches()}


@app.post("/api/batches/{batch_id}/collection")
async def batch_to_collection(
    batch_id: int,
    payload: BatchCollectionRequest,
    _session: Any = Depends(require_authenticated),
):
    collection = db.create_collection_from_batch(batch_id, payload.name, payload.description or "")
    if not collection:
        raise HTTPException(status_code=404, detail="This batch has no active photos.")
    return collection

# Serve frontend static files
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="static")



