# AGENTS.md

PhotoLens Analyzer: FastAPI backend (`backend/`) serving a static vanilla-JS frontend (`frontend/`). No build step, no npm, no tests, no lint config, no CI.

## Commands

- Always run from repo root: `backend/main.py` uses `from backend.exif_engine import ...` and `start_server.py` references `"backend.main:app"`.
- Dev server: `python start_server.py` (uvicorn reload, port **8765**). This is the only entry point; the `__main__` block in `main.py` has been removed.
- Install: `pip install -r requirements.txt` into `.venv` (Python 3.13).
- Verification = import check + manual run: `python -c "from backend.main import app"`, then start the server and POST photos to `/api/analyze`.

## Gotchas

- New API routes must be defined **above** the catch-all `app.mount("/", StaticFiles(...))` at the bottom of `backend/main.py:753`, or they will 404.
- API data contract: `/api/analyze` returns `{photos, stats, errors, ...}` and the frontend reads everything from `data.stats.*` (`focal_groups`, `focal_dist`, `aperture_dist`, `iso_dist`, `cameras`, `lenses`, `monthly`, `hourly`, `dow`, `formats`, `averages.*`, `recommendations`). Renaming `compute_stats` keys breaks `frontend/app.js`.
- `frontend/` contains tracked stale copies (`*.bak`, `*.backup`) — edit only `index.html`, `styles.css`, `app.js`. `.gitignore` covers `__pycache__`, `.DS_Store`, and `backend/data/`; the stale `.bak`/`.backup` files were committed before `.gitignore` was added.
- All UI strings are bilingual: add keys to **both** `en` and `zh` in the `I18N` dict at the top of `frontend/app.js`, and reference them via `data-i18n` attributes in `index.html`. Default language is `zh` (localStorage `photolens-lang`). Chart tooltip units also use `t('chart.photos_unit')` and `t('chart.hour_label')`. Backend lens recommendations (`generate_recommendations` in `main.py`) are hardcoded Chinese.
- Charts/animations use local vendored libs in `frontend/vendor/` (ECharts, GSAP, ScrollTrigger). Google Fonts (DM Sans, JetBrains Mono) are loaded from CDN in `index.html` — not vendored.
- `camera_data.json` keys are lowercase camera model names matched fuzzily by substring to get crop factors; its `focal_groups` (min/max/label) drive focal grouping and recommendations.
- Upload handling skips macOS `._` resource-fork files and flattens folder uploads to basenames (duplicates get `_1`, `_2` suffixes) in a temp dir.
- `main.py` serves `database.py` (SQLite) and `auth.py` (single-user scrypt auth). The runtime DB lives in `backend/data/` (gitignored).
