"""SQLite persistence for accumulated EXIF metadata and user collections."""

import hashlib
import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional


DATA_DIR = Path(__file__).resolve().parent / "data"
DB_PATH = DATA_DIR / "photolens.db"

PHOTO_FIELDS = (
    "id", "content_hash", "filename", "file_size", "camera_model", "lens_model",
    "focal_length", "focal_35mm", "equiv_focal", "focal_group", "aperture",
    "iso", "exposure_time", "date_original_raw", "captured_at", "format",
    "batch_id", "first_seen_at", "last_seen_at", "deleted_at",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@contextmanager
def db_connection():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Create the current schema and migrate databases from earlier versions."""
    with db_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS photos (
                id INTEGER PRIMARY KEY,
                content_hash TEXT UNIQUE NOT NULL,
                filename TEXT NOT NULL,
                file_size INTEGER,
                camera_model TEXT,
                lens_model TEXT,
                focal_length REAL,
                focal_35mm REAL,
                equiv_focal REAL,
                focal_group TEXT,
                aperture REAL,
                iso INTEGER,
                exposure_time REAL,
                date_original_raw TEXT,
                captured_at TEXT,
                format TEXT,
                batch_id INTEGER,
                first_seen_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL,
                deleted_at TEXT
            );

            CREATE TABLE IF NOT EXISTS batches (
                id INTEGER PRIMARY KEY,
                uploaded_at TEXT NOT NULL,
                total_files INTEGER NOT NULL,
                parsed_count INTEGER NOT NULL DEFAULT 0,
                saved_count INTEGER NOT NULL DEFAULT 0,
                duplicate_count INTEGER NOT NULL DEFAULT 0,
                unsupported_count INTEGER NOT NULL DEFAULT 0,
                error_count INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS collections (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                color TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS collection_photos (
                collection_id INTEGER NOT NULL,
                photo_id INTEGER NOT NULL,
                added_at TEXT NOT NULL,
                PRIMARY KEY (collection_id, photo_id),
                FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
                FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS auth_config (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY,
                token_hash TEXT UNIQUE NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                last_seen_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_photos_captured_at
                ON photos(captured_at);
            CREATE INDEX IF NOT EXISTS idx_photos_deleted_at
                ON photos(deleted_at);
            CREATE INDEX IF NOT EXISTS idx_photos_camera_model
                ON photos(camera_model);
            CREATE INDEX IF NOT EXISTS idx_photos_lens_model
                ON photos(lens_model);
            CREATE INDEX IF NOT EXISTS idx_photos_format
                ON photos(format);
            CREATE INDEX IF NOT EXISTS idx_collections_photo
                ON collection_photos(photo_id);
            CREATE UNIQUE INDEX IF NOT EXISTS idx_collections_name
                ON collections(name);
        """)

        photo_columns = {row["name"] for row in conn.execute("PRAGMA table_info(photos)")}
        migrations = {
            "captured_at": "ALTER TABLE photos ADD COLUMN captured_at TEXT",
            "batch_id": "ALTER TABLE photos ADD COLUMN batch_id INTEGER",
            "deleted_at": "ALTER TABLE photos ADD COLUMN deleted_at TEXT",
        }
        for column, statement in migrations.items():
            if column not in photo_columns:
                conn.execute(statement)
        conn.execute("PRAGMA user_version = 1")


def parse_exif_date(value: Any) -> Optional[str]:
    """Convert common EXIF date forms to a sortable ISO-8601 string."""
    if not value:
        return None
    raw = str(value).strip()
    formats = (
        "%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y:%m:%d %H:%M",
        "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M",
    )
    for fmt in formats:
        try:
            return datetime.strptime(raw[:len(datetime.strptime("2000", "%Y").strftime(fmt))].strip(), fmt).isoformat(timespec="seconds")
        except (ValueError, TypeError):
            continue
    return None


def _photo_values(data: dict, content_hash: str, file_size: int, batch_id: Optional[int]) -> tuple:
    date_raw = data.get("date")
    return (
        content_hash,
        data.get("filename", "unknown"),
        file_size,
        data.get("camera_model"),
        data.get("lens_model"),
        data.get("focal_length"),
        data.get("focal_35mm"),
        data.get("equiv_focal"),
        data.get("focal_group"),
        data.get("aperture"),
        data.get("iso"),
        data.get("exposure_time"),
        date_raw,
        parse_exif_date(date_raw),
        data.get("format"),
        batch_id,
    )


def save_photo(data: dict, content_hash: str, file_size: int,
               batch_id: Optional[int] = None) -> tuple[int, bool]:
    """Insert one EXIF record. Returns (photo_id, inserted)."""
    now = utc_now()
    values = _photo_values(data, content_hash, file_size, batch_id)
    with db_connection() as conn:
        cursor = conn.execute("""
            INSERT OR IGNORE INTO photos (
                content_hash, filename, file_size, camera_model, lens_model,
                focal_length, focal_35mm, equiv_focal, focal_group, aperture,
                iso, exposure_time, date_original_raw, captured_at, format,
                batch_id, first_seen_at, last_seen_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, values + (now, now))
        if cursor.rowcount == 1:
            photo_id = cursor.lastrowid
            inserted = True
        else:
            row = conn.execute(
                "SELECT id FROM photos WHERE content_hash = ?", (content_hash,)
            ).fetchone()
            photo_id = row["id"]
            inserted = False
            conn.execute(
                "UPDATE photos SET last_seen_at = ? WHERE id = ?", (now, photo_id)
            )
        return photo_id, inserted


def create_batch(total_files: int) -> int:
    with db_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO batches (uploaded_at, total_files) VALUES (?, ?)",
            (utc_now(), total_files),
        )
        return cursor.lastrowid


def update_batch(batch_id: int, **counts: int) -> None:
    if not counts:
        return
    assignments = ", ".join(f"{key} = ?" for key in counts)
    with db_connection() as conn:
        conn.execute(
            f"UPDATE batches SET {assignments} WHERE id = ?",
            (*counts.values(), batch_id),
        )


def add_photo_to_collection(photo_id: int, collection_id: int) -> bool:
    with db_connection() as conn:
        cursor = conn.execute("""
            INSERT OR IGNORE INTO collection_photos (collection_id, photo_id, added_at)
            VALUES (?, ?, ?)
        """, (collection_id, photo_id, utc_now()))
        return cursor.rowcount == 1


def remove_photo_from_collection(photo_id: int, collection_id: int) -> bool:
    with db_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM collection_photos WHERE collection_id = ? AND photo_id = ?",
            (collection_id, photo_id),
        )
        return cursor.rowcount > 0


def list_collections(include_deleted: bool = False) -> list[dict]:
    del include_deleted
    with db_connection() as conn:
        rows = conn.execute("""
            SELECT c.id, c.name, c.description, c.color, c.created_at, c.updated_at,
                   COUNT(cp.photo_id) AS photo_count,
                   MAX(p.captured_at) AS latest_captured_at
            FROM collections c
            LEFT JOIN collection_photos cp ON cp.collection_id = c.id
            LEFT JOIN photos p ON p.id = cp.photo_id AND p.deleted_at IS NULL
            GROUP BY c.id
            ORDER BY c.name COLLATE NOCASE
        """).fetchall()
        return [dict(row) for row in rows]


def get_collection(collection_id: int) -> Optional[dict]:
    with db_connection() as conn:
        row = conn.execute(
            "SELECT * FROM collections WHERE id = ?", (collection_id,)
        ).fetchone()
        return dict(row) if row else None


def create_collection(name: str, description: Optional[str], color: Optional[str]) -> dict:
    now = utc_now()
    with db_connection() as conn:
        cursor = conn.execute("""
            INSERT INTO collections (name, description, color, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (name.strip(), description, color, now, now))
        collection_id = cursor.lastrowid
    return get_collection(collection_id)


def update_collection(collection_id: int, updates: dict) -> Optional[dict]:
    if not updates:
        return get_collection(collection_id)
    assignments = ", ".join(f"{key} = ?" for key in updates)
    values = list(updates.values()) + [utc_now(), collection_id]
    with db_connection() as conn:
        cursor = conn.execute(
            f"UPDATE collections SET {assignments}, updated_at = ? WHERE id = ?", values
        )
        if cursor.rowcount == 0:
            return None
    return get_collection(collection_id)


def delete_collection(collection_id: int) -> bool:
    with db_connection() as conn:
        cursor = conn.execute("DELETE FROM collections WHERE id = ?", (collection_id,))
        return cursor.rowcount > 0


def _collection_filter(collection_id: Any) -> tuple[str, list]:
    if collection_id == "none":
        return """
            AND NOT EXISTS (
                SELECT 1 FROM collection_photos cp
                WHERE cp.photo_id = p.id
            )
        """, []
    if collection_id in (None, "", "all"):
        return "", []
    try:
        numeric_id = int(collection_id)
    except (TypeError, ValueError):
        return "", []
    return """
        AND EXISTS (
            SELECT 1 FROM collection_photos cp
            WHERE cp.photo_id = p.id AND cp.collection_id = ?
        )
    """, [numeric_id]


def list_photos(
    collection_id: Any = "all",
    query: str = "",
    camera: str = "",
    lens: str = "",
    file_format: str = "",
    date_from: str = "",
    date_to: str = "",
    deleted: bool = False,
    sort: str = "captured_at",
    order: str = "desc",
    limit: int = 50,
    offset: int = 0,
) -> dict:
    collection_sql, params = _collection_filter(collection_id)
    where = ["p.deleted_at IS NULL" if not deleted else "p.deleted_at IS NOT NULL"]
    if collection_sql:
        where.append(collection_sql)
    if query:
        where.append("(p.filename LIKE ? OR p.camera_model LIKE ? OR p.lens_model LIKE ? OR p.focal_group LIKE ? OR p.format LIKE ?)")
        like = f"%{query}%"
        params.extend([like] * 5)
    if camera:
        where.append("p.camera_model LIKE ?")
        params.append(f"%{camera}%")
    if lens:
        where.append("p.lens_model LIKE ?")
        params.append(f"%{lens}%")
    if file_format:
        where.append("p.format LIKE ?")
        params.append(f"%{file_format}%")
    if date_from:
        where.append("p.captured_at >= ?")
        params.append(date_from)
    if date_to:
        where.append("p.captured_at <= ?")
        params.append(f"{date_to}T23:59:59")

    sort_columns = {
        "captured_at": "p.captured_at",
        "filename": "p.filename COLLATE NOCASE",
        "camera": "p.camera_model COLLATE NOCASE",
        "iso": "p.iso",
    }
    sort_column = sort_columns.get(sort, sort_columns["captured_at"])
    direction = "DESC" if str(order).lower() == "desc" else "ASC"
    limit = max(1, min(int(limit), 500))
    offset = max(0, int(offset))
    where_sql = " AND ".join(where)

    with db_connection() as conn:
        total = conn.execute(f"""
            SELECT COUNT(*) FROM photos p WHERE {where_sql}
        """, params).fetchone()[0]
        rows = conn.execute(f"""
            SELECT {", ".join("p." + field for field in PHOTO_FIELDS)}
            FROM photos p
            WHERE {where_sql}
            ORDER BY {sort_column} {direction}, p.id DESC
            LIMIT ? OFFSET ?
        """, params + [limit, offset]).fetchall()
        photos = []
        for row in rows:
            item = dict(row)
            memberships = conn.execute("""
                SELECT c.id, c.name, c.color
                FROM collection_photos cp
                JOIN collections c ON c.id = cp.collection_id
                WHERE cp.photo_id = ?
                ORDER BY c.name COLLATE NOCASE
            """, (item["id"],)).fetchall()
            item["collections"] = [dict(membership) for membership in memberships]
            photos.append(item)
        return {"photos": photos, "total": total, "limit": limit, "offset": offset}


def get_photo(photo_id: int) -> Optional[dict]:
    with db_connection() as conn:
        row = conn.execute(f"""
            SELECT {", ".join(PHOTO_FIELDS)} FROM photos WHERE id = ?
        """, (photo_id,)).fetchone()
        if not row:
            return None
        photo = dict(row)
        memberships = conn.execute("""
            SELECT c.id, c.name, c.color
            FROM collection_photos cp
            JOIN collections c ON c.id = cp.collection_id
            WHERE cp.photo_id = ?
            ORDER BY c.name COLLATE NOCASE
        """, (photo_id,)).fetchall()
        photo["collections"] = [dict(membership) for membership in memberships]
        return photo


def update_photo(photo_id: int, updates: dict) -> Optional[dict]:
    if not updates:
        return get_photo(photo_id)
    assignments = ", ".join(f"{key} = ?" for key in updates)
    with db_connection() as conn:
        cursor = conn.execute(
            f"UPDATE photos SET {assignments}, last_seen_at = ? WHERE id = ?",
            (*updates.values(), utc_now(), photo_id),
        )
        if cursor.rowcount == 0:
            return None
    return get_photo(photo_id)


def set_photo_deleted(photo_ids: list[int], deleted: bool) -> int:
    if not photo_ids:
        return 0
    placeholders = ",".join("?" for _ in photo_ids)
    with db_connection() as conn:
        cursor = conn.execute(f"""
            UPDATE photos
            SET deleted_at = ?
            WHERE id IN ({placeholders}) AND deleted_at {'IS NULL' if deleted else 'IS NOT NULL'}
        """, (utc_now() if deleted else None, *photo_ids))
        return cursor.rowcount


def purge_deleted() -> int:
    with db_connection() as conn:
        cursor = conn.execute("DELETE FROM photos WHERE deleted_at IS NOT NULL")
        return cursor.rowcount


def collection_photo_ids(collection_id: int) -> list[int]:
    with db_connection() as conn:
        rows = conn.execute(
            "SELECT photo_id FROM collection_photos WHERE collection_id = ?",
            (collection_id,),
        ).fetchall()
        return [row["photo_id"] for row in rows]


def list_batches() -> list[dict]:
    with db_connection() as conn:
        rows = conn.execute("""
            SELECT b.*, COUNT(p.id) AS stored_photo_count
            FROM batches b
            LEFT JOIN photos p ON p.batch_id = b.id AND p.deleted_at IS NULL
            GROUP BY b.id
            ORDER BY b.uploaded_at DESC
        """).fetchall()
        return [dict(row) for row in rows]


def create_collection_from_batch(batch_id: int, name: str,
                                 description: str = "") -> Optional[dict]:
    with db_connection() as conn:
        photo_ids = [
            row["id"] for row in conn.execute(
                "SELECT id FROM photos WHERE batch_id = ? AND deleted_at IS NULL",
                (batch_id,),
            )
        ]
    if not photo_ids:
        return None
    collection = create_collection(name, description, None)
    for photo_id in photo_ids:
        add_photo_to_collection(photo_id, collection["id"])
    return get_collection(collection["id"])


def photos_for_stats(scope: str = "all", collection_id: Any = None) -> list[dict]:
    where = ["deleted_at IS NULL"]
    params: list[Any] = []
    if scope == "ungrouped":
        where.append("""
            NOT EXISTS (
                SELECT 1 FROM collection_photos cp WHERE cp.photo_id = photos.id
            )
        """)
    elif scope == "collection":
        try:
            numeric_id = int(collection_id)
        except (TypeError, ValueError):
            return []
        where.append("""
            EXISTS (
                SELECT 1 FROM collection_photos cp
                WHERE cp.photo_id = photos.id AND cp.collection_id = ?
            )
        """)
        params.append(numeric_id)
    with db_connection() as conn:
        rows = conn.execute(f"""
            SELECT id, filename, camera_model, lens_model, focal_length,
                   focal_35mm, equiv_focal, focal_group, aperture, iso,
                   exposure_time, date_original_raw, captured_at, format
            FROM photos
            WHERE {" AND ".join(where)}
            ORDER BY captured_at DESC, id DESC
        """, params).fetchall()
        photos = []
        for row in rows:
            item = dict(row)
            item["date"] = item.pop("captured_at") or item.pop("date_original_raw")
            photos.append(item)
        return photos


def photo_options(column: str) -> list[str]:
    if column not in {"camera_model", "lens_model", "format"}:
        return []
    with db_connection() as conn:
        rows = conn.execute(f"""
            SELECT DISTINCT {column}
            FROM photos
            WHERE deleted_at IS NULL AND {column} IS NOT NULL AND {column} != ''
            ORDER BY {column} COLLATE NOCASE
        """).fetchall()
        return [row[0] for row in rows]


def app_summary() -> dict:
    with db_connection() as conn:
        totals = conn.execute("""
            SELECT
              COUNT(*) AS all_photos,
              SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS active_photos,
              SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) AS deleted_photos
            FROM photos
        """).fetchone()
        collections = conn.execute("SELECT COUNT(*) FROM collections").fetchone()[0]
        batches = conn.execute("SELECT COUNT(*) FROM batches").fetchone()[0]
        ungrouped = conn.execute("""
            SELECT COUNT(*)
            FROM photos
            WHERE deleted_at IS NULL AND NOT EXISTS (
                SELECT 1 FROM collection_photos cp WHERE cp.photo_id = photos.id
            )
        """).fetchone()[0]
        return {
            "all_photos": totals["all_photos"] or 0,
            "active_photos": totals["active_photos"] or 0,
            "deleted_photos": totals["deleted_photos"] or 0,
            "ungrouped_photos": ungrouped,
            "collections": collections,
            "batches": batches,
        }
