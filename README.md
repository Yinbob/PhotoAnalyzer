# PhotoLens Analyzer

A web-based photography analytics tool that analyzes EXIF data from your photos to help you understand your shooting habits and make informed lens upgrade decisions.

![PhotoLens Analyzer](FocalLengthAnalyzer_logo.png)

## Features

- **Multi-format Support** - JPEG, RAW (ARW/CR2/NEF/DNG/ORF/RAF/RW2/PEF), HEIF/HEIC, TIFF, PNG
- **Drag & Drop Upload** - Upload photos directly in the browser
- **EXIF Extraction** - Automatic reading of focal length, aperture, ISO, shutter speed, camera & lens info
- **35mm Equivalent** - Auto-converts to 35mm equivalent focal length with camera crop factor database
- **Interactive Dashboard** - Rich visualizations powered by ECharts
- **Lens Recommendations** - AI-powered insights for lens upgrade decisions

## Visualizations

- Focal length group distribution (pie chart)
- Detailed focal length usage (bar chart)
- Aperture distribution
- ISO distribution
- Camera & lens usage breakdown
- Shooting timeline (monthly)
- Hourly shooting patterns
- Day-of-week radar chart
- File format distribution
- Data table with all photo details

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8765 --reload
```

### 3. Open in Browser

Visit [http://127.0.0.1:8765](http://127.0.0.1:8765)

### 4. Upload Photos

Drag & drop your photos or click "Select Photos" to choose files. The dashboard will update automatically with your shooting statistics.

## Project Structure

```
FocalLengthAnalyzer/
├── backend/
│   ├── main.py              # FastAPI server with API endpoints
│   ├── exif_engine.py       # Multi-format EXIF extraction engine
│   └── camera_data.json     # Camera crop factor database
├── frontend/
│   ├── index.html           # Dashboard page
│   ├── styles.css           # Dark theme styling
│   └── app.js               # Frontend logic & ECharts visualizations
├── main/                    # Legacy CLI version
│   ├── main.py
│   └── camera_crop_factors.json
├── requirements.txt         # Python dependencies
└── README.md
```

## API

### `POST /api/analyze`

Upload photos for analysis.

**Request:** `multipart/form-data` with `files` field containing image files.

**Response:**
```json
{
  "photos": [...],
  "stats": {
    "total": 150,
    "focal_groups": {...},
    "focal_dist": {...},
    "aperture_dist": {...},
    "iso_dist": {...},
    "cameras": {...},
    "lenses": {...},
    "monthly": {...},
    "hourly": {...},
    "dow": {...},
    "recommendations": [...],
    "averages": {...}
  },
  "errors": [],
  "total_processed": 150,
  "total_errors": 0
}
```

## Supported Cameras

The tool includes a comprehensive camera database with crop factors for:

- **Sony** - A7/A9/A1 series (FF), A6000/A6700 series (APS-C)
- **Canon** - EOS R1/R3/R5/R6/R8 (FF), R7/R10/R50 (APS-C), 5D/6D/1D series
- **Nikon** - Z5/Z6/Z7/Z8/Z9 (FF), Z30/Z50 (APS-C), D-series
- **Fujifilm** - X-H/X-T/X-Pro/X-E series (APS-C), X100 series
- **Olympus/OM System** - OM-1/OM-5/E-M series (M43)
- **Panasonic** - S-series (FF), GH/G/GX series (M43)
- **Leica** - SL/Q/M series
- **Hasselblad** - X/X2D series
- **DJI** - Mavic/Air/Mini series
- **Ricoh** - GR III/GR IIIx

## Technology Stack

- **Backend:** Python, FastAPI, Pillow, exif, rawpy, pillow-heif
- **Frontend:** HTML5, CSS3, JavaScript, ECharts 5
- **Design:** Dark theme, responsive layout, drag & drop upload
