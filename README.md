# PhotoLens Analyzer

A web-based photography analytics tool that analyzes EXIF data from your photos to help you understand your shooting habits and make informed lens upgrade decisions.

![PhotoLens Analyzer](FocalLengthAnalyzer/FocalLengthAnalyzer_logo.png)

## ✨ Features

### Core Features
- **Multi-format Support** - JPEG, RAW (ARW/CR2/NEF/DNG/ORF/RAF/RW2/PEF), HEIF/HEIC, TIFF, PNG
- **Drag & Drop Upload** - Upload photos directly in the browser
- **EXIF Extraction** - Automatic reading of focal length, aperture, ISO, shutter speed, camera & lens info
- **35mm Equivalent** - Auto-converts to 35mm equivalent focal length with camera crop factor database
- **Interactive Dashboard** - Rich visualizations powered by ECharts
- **Lens Recommendations** - AI-powered insights for lens upgrade decisions

### UI Design (Glassmorphism)
- **Modern Glass Effects** - Transparent cards with blur backgrounds and refined borders
- **Professional Color Scheme** - Dark background with green accent color
- **Fira Typography** - Fira Sans (body) + Fira Code (data) for enhanced readability
- **Smooth Animations** - GSAP-powered animations including:
  - Page entry animations
  - Card hover effects
  - Number counting animations
  - Progress bar animations
  - Scroll-triggered animations

## 📊 Visualizations

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

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Server

```bash
cd /Users/yinzh/PythonProjects/PhotoAnalyzer
source .venv/bin/activate
python -c "
from backend.main import app
import uvicorn
uvicorn.run(app, host='0.0.0.0', port=8080)
"
```

### 3. Open in Browser

Visit [http://localhost:8080](http://localhost:8080)

### 4. Upload Photos

Drag & drop your photos or click "Select Photos" to choose files. The dashboard will update automatically with your shooting statistics.

## 📁 Project Structure

```
PhotoAnalyzer/
├── backend/
│   ├── main.py              # FastAPI server with API endpoints
│   ├── exif_engine.py       # Multi-format EXIF extraction engine
│   └── camera_data.json     # Camera crop factor database
├── frontend/
│   ├── index.html           # Dashboard page
│   ├── styles.css           # Glassmorphism dark theme styling
│   ├── app.js               # Frontend logic & ECharts visualizations
│   └── vendor/              # Third-party libraries (ECharts, GSAP)
├── FocalLengthAnalyzer/     # Related project (original version)
├── requirements.txt         # Python dependencies
└── README.md
```

## 🔌 API

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

### `POST /api/export-csv`

Export analysis results as CSV file.

## 📷 Supported Cameras

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

## 🛠 Technology Stack

- **Backend:** Python 3.13, FastAPI, Pillow, exif, rawpy, pillow-heif, pandas
- **Frontend:** HTML5, CSS3, JavaScript, ECharts 5, GSAP 3
- **Design:** Glassmorphism dark theme, responsive layout, drag & drop upload

## 🎯 Browser Compatibility

- ✅ Chrome 76+
- ✅ Firefox 72+
- ✅ Safari 13+
- ✅ Edge 79+

## 📱 Responsive Design

- ✅ Desktop (1440px+)
- ✅ Tablet (768px-1023px)
- ✅ Mobile (<768px)

## ♿ Accessibility

- Keyboard navigation support
- Focus state indicators
- Screen reader compatible
- Reduced motion support

## 📄 License

MIT License
