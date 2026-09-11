"""
EXIF extraction engine supporting JPEG, RAW, HEIF, TIFF, PNG formats.
Uses multiple backends with graceful fallbacks.
"""
import os
import json
import tempfile
from pathlib import Path
from typing import Optional

# Format support detection
_HAS_RAWPY = False
_HAS_HEIF = False
_HAS_EXIFREAD = False

try:
    import rawpy
    _HAS_RAWPY = True
except ImportError:
    pass

try:
    import exifread
    _HAS_EXIFREAD = True
except ImportError:
    pass

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    _HAS_HEIF = True
except ImportError:
    pass

from PIL import Image
from PIL.ExifTags import TAGS

RAW_EXTENSIONS = {'.arw', '.cr2', '.cr3', '.nef', '.orf', '.raf', '.rw2',
                  '.dng', '.pef', '.srw', '.x3f', '.3fr', '.ari', '.bay',
                  '.cap', '.iiq', '.erf', '.fff', '.mef', '.mos', '.mrw',
                  '.nrw', '.ptx', '.raw', '.rwl', '.sr2', '.srf', '.kdc',
                  '.dcr'}
HEIF_EXTENSIONS = {'.heif', '.heic'}
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.tiff', '.tif', '.png', '.webp'} | RAW_EXTENSIONS | HEIF_EXTENSIONS

FOCAL_GROUP_ORDER = [
    "ultra_wide", "ultra_wide_20", "wide", "standard_wide", "normal",
    "portrait", "medium_tele", "tele", "super_tele_300", "super_tele_400",
    "super_tele_500", "super_tele_600"
]


class ExifEngine:
    def __init__(self, camera_data_path: str):
        with open(camera_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        self.crop_factors = data.get("crop_factors", {})
        self.focal_groups = data.get("focal_groups", {})

    def get_crop_factor(self, camera_model: str) -> float:
        if not camera_model:
            return 1.0
        model_lower = camera_model.lower().strip()
        if model_lower in self.crop_factors:
            return self.crop_factors[model_lower]
        # Fuzzy: check if any key is contained in the model name
        for key, val in self.crop_factors.items():
            if key in model_lower or model_lower in key:
                return val
        return 1.0

    def extract_single(self, file_path: str) -> Optional[dict]:
        """Extract EXIF data from a single image file."""
        ext = Path(file_path).suffix.lower()

        if ext in RAW_EXTENSIONS:
            return self._extract_raw(file_path)
        elif ext in HEIF_EXTENSIONS:
            return self._extract_heif(file_path)
        elif ext in IMAGE_EXTENSIONS:
            return self._extract_pil(file_path)
        return None

    def _extract_pil(self, file_path: str) -> Optional[dict]:
        """Extract EXIF using Pillow (JPEG, TIFF, PNG)."""
        try:
            with Image.open(file_path) as img:
                raw_exif = img._getexif()
                if raw_exif is None:
                    return None

                exif = {}
                for tag_id, value in raw_exif.items():
                    tag = TAGS.get(tag_id, tag_id)
                    exif[tag] = value

                return self._parse_exif_dict(exif, file_path)
        except Exception as e:
            return {"filename": os.path.basename(file_path), "error": str(e)}

    def _extract_raw(self, file_path: str) -> Optional[dict]:
        """Extract EXIF from RAW files via embedded preview or metadata parser."""
        raw_error = None
        if _HAS_RAWPY:
            try:
                with rawpy.imread(file_path) as raw:
                    thumb = raw.extract_thumb()
                ext_map = {
                    getattr(rawpy.ThumbFormat, "JPEG", 1): ".jpg",
                    getattr(rawpy.ThumbFormat, "BITMAP", 2): ".bmp",
                }
                ext = ext_map.get(thumb.format, ".img")
                with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
                    tmp.write(thumb.data)
                    tmp_path = tmp.name
                try:
                    parsed = self._extract_pil(tmp_path)
                    if parsed and not parsed.get("error"):
                        parsed["filename"] = os.path.basename(file_path)
                        return parsed
                finally:
                    os.unlink(tmp_path)
            except Exception as e:
                raw_error = str(e)
        if _HAS_EXIFREAD:
            try:
                with open(file_path, "rb") as f:
                    tags = exifread.process_file(f, details=False)
                if tags:
                    return self._parse_exifread_dict(tags, file_path)
            except Exception as e:
                raw_error = raw_error or str(e)
        try:
            return self._extract_pil(file_path)
        except Exception as e:
            return {
                "filename": os.path.basename(file_path),
                "error": f"Cannot read RAW file: {raw_error or e}",
            }

    def _parse_exifread_dict(self, tags: dict, file_path: str) -> Optional[dict]:
        """Convert exifread tags to the same standardized structure used by Pillow."""
        def tag(*names: str) -> str:
            for name in names:
                value = tags.get(name)
                if value is not None:
                    return str(value).strip()
            return ""

        exif = {
            "Model": tag("Image Model", "EXIF Model", "Thumbnail Model"),
            "LensModel": tag("EXIF LensModel", "Image LensModel", "Thumbnail LensModel"),
            "FocalLength": self._exifread_number(
                tags.get("EXIF FocalLength")
                or tags.get("Image FocalLength")
                or tags.get("Thumbnail FocalLength")
            ),
            "FocalLengthIn35mmFilm": self._exifread_number(
                tags.get("EXIF FocalLengthIn35mmFilm")
                or tags.get("Image FocalLengthIn35mmFilm")
            ),
            "FNumber": self._exifread_number(
                tags.get("EXIF FNumber")
                or tags.get("Image FNumber")
                or tags.get("Thumbnail FNumber")
            ),
            "ISOSpeedRatings": self._exifread_int(
                tags.get("EXIF ISOSpeedRatings")
                or tags.get("Image ISOSpeedRatings")
                or tags.get("Thumbnail ISOSpeedRatings")
            ),
            "ExposureTime": self._exifread_number(
                tags.get("EXIF ExposureTime")
                or tags.get("Image ExposureTime")
                or tags.get("Thumbnail ExposureTime")
            ),
            "DateTimeOriginal": tag(
                "EXIF DateTimeOriginal", "Image DateTimeOriginal",
                "Image DateTime", "EXIF DateTimeDigitized",
            ),
        }
        return self._parse_exif_dict(exif, file_path)

    @staticmethod
    def _exifread_number(value) -> Optional[float]:
        if value is None:
            return None
        text = str(value).strip().strip('[]')
        if not text:
            return None
        try:
            if "," in text:
                parts = [part.strip() for part in text.split(",") if part.strip()]
                if len(parts) == 2:
                    return float(parts[0]) / float(parts[1])
                if parts:
                    return float(parts[0])
            if "/" in text:
                numerator, denominator = text.split("/", 1)
                return float(numerator) / float(denominator)
            return float(text)
        except (ValueError, ZeroDivisionError, TypeError):
            return None

    @staticmethod
    def _exifread_int(value) -> Optional[int]:
        number = ExifEngine._exifread_number(value)
        return int(number) if number is not None else None

    def _extract_heif(self, file_path: str) -> Optional[dict]:
        """Extract EXIF from HEIF/HEIC files."""
        if not _HAS_HEIF:
            return {"filename": os.path.basename(file_path),
                    "error": "pillow-heif not installed - cannot read HEIF files"}
        try:
            return self._extract_pil(file_path)
        except Exception as e:
            return {"filename": os.path.basename(file_path),
                    "error": f"Cannot read HEIF file: {e}"}

    def _parse_exif_dict(self, exif: dict, file_path: str) -> Optional[dict]:
        """Parse common EXIF tags into a standardized dict."""
        # Camera model
        camera_model = str(exif.get("Model", "") or "").strip()

        # Lens model
        lens_model = str(exif.get("LensModel", "") or
                         exif.get("LensInfo", "") or "").strip()

        # Focal length
        focal_length = self._to_float(exif.get("FocalLength"))
        focal_35mm = self._to_float(exif.get("FocalLengthIn35mmFilm"))

        # Aperture
        aperture = self._to_float(exif.get("FNumber"))
        if aperture is None:
            aperture = self._aperture_from_value(exif.get("ApertureValue"))

        # ISO
        iso = self._to_int(exif.get("ISOSpeedRatings"))

        # Shutter speed
        exposure_time = self._to_float(exif.get("ExposureTime"))

        # Date
        date_str = str(exif.get("DateTimeOriginal", "") or
                       exif.get("DateTime", "") or "").strip()

        # Calculate 35mm equivalent
        if focal_35mm and focal_35mm > 0:
            equiv_focal = focal_35mm
        elif focal_length and focal_length > 0:
            crop = self.get_crop_factor(camera_model)
            equiv_focal = round(focal_length * crop, 1)
        else:
            equiv_focal = None

        # Focal group
        focal_group = self.get_focal_group(equiv_focal) if equiv_focal else "unknown"

        return {
            "filename": os.path.basename(file_path),
            "camera_model": camera_model or "Unknown",
            "lens_model": lens_model or "Unknown",
            "focal_length": focal_length,
            "focal_35mm": focal_35mm,
            "equiv_focal": equiv_focal,
            "focal_group": focal_group,
            "aperture": aperture,
            "iso": iso,
            "exposure_time": exposure_time,
            "date": date_str,
            "format": Path(file_path).suffix.lower().lstrip('.').upper(),
        }

    def get_focal_group(self, equiv_focal: float) -> str:
        if equiv_focal is None:
            return "unknown"
        for group_key in FOCAL_GROUP_ORDER:
            group = self.focal_groups.get(group_key, {})
            if group.get("min", 0) <= equiv_focal <= group.get("max", 9999):
                return self.focal_groups[group_key]["label"]
        return f"{int(round(equiv_focal))}mm"

    @staticmethod
    def _to_float(val) -> Optional[float]:
        if val is None:
            return None
        if isinstance(val, tuple) and len(val) == 2:
            try:
                return val[0] / val[1]
            except (ZeroDivisionError, TypeError):
                return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _to_int(val) -> Optional[int]:
        if val is None:
            return None
        if isinstance(val, (list, tuple)):
            val = val[0]
        try:
            return int(val)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _aperture_from_value(val) -> Optional[float]:
        if val is None:
            return None
        try:
            import math
            f_val = float(val)
            return round(math.sqrt(2 ** f_val), 1)
        except (ValueError, TypeError):
            return None
