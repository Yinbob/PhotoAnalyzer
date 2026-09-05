"""
PhotoAnalyzer - FastAPI Backend
Serves the frontend and provides EXIF analysis API.
"""
import os
import json
import tempfile
import shutil
from pathlib import Path
from collections import Counter, defaultdict
from typing import List

from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.exif_engine import ExifEngine, IMAGE_EXTENSIONS

app = FastAPI(title="PhotoAnalyzer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
CAMERA_DATA_PATH = Path(__file__).resolve().parent / "camera_data.json"

engine = ExifEngine(str(CAMERA_DATA_PATH))


@app.get("/")
async def index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/api/analyze")
async def analyze_photos(files: List[UploadFile] = File(...)):
    """Analyze uploaded photo files and return EXIF statistics."""
    results = []
    errors = []

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
            with open(file_path, "wb") as f:
                f.write(content)

            data = engine.extract_single(file_path)
            if data is None:
                errors.append(f"No EXIF data: {upload.filename}")
            elif "error" in data:
                errors.append(f"{upload.filename}: {data['error']}")
            else:
                results.append(data)

    stats = compute_stats(results)
    return JSONResponse({
        "photos": results,
        "stats": stats,
        "errors": errors,
        "total_processed": len(results),
        "total_errors": len(errors),
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
    from datetime import datetime
    dow_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    dow = Counter()
    for p in photos:
        date_str = p.get("date", "")
        if date_str:
            try:
                dt = datetime.strptime(date_str[:19], "%Y-%m-%d %H:%M:%S")
                dow[dow_names[dt.weekday()]] += 1
            except (ValueError, IndexError):
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

# Serve frontend static files
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
