# PhotoLens Analyzer — 照片镜头分析器

> 语言 / Language: **[中文](#中文)** · **[English](#english)**

---

<a id="中文"></a>

# 📷 照片镜头分析器

一款基于 Web 的摄影分析工具，通过分析照片 EXIF 数据，帮助您了解拍摄习惯，为镜头升级决策提供数据支持。

## ✨ 功能特性

### 核心功能

- **多格式支持** — JPEG、RAW（ARW/CR2/NEF/DNG/ORF/RAF/RW2/PEF 等）、HEIF/HEIC、TIFF、PNG
- **拖拽上传** — 在浏览器中直接拖拽上传照片或整个文件夹
- **EXIF 提取** — 自动读取焦距、光圈、ISO、快门速度、相机和镜头信息
- **35mm 等效焦距** — 根据相机裁切系数数据库自动转换
- **交互式仪表板** — 基于 ECharts 的丰富可视化图表
- **镜头推荐** — 数据驱动的镜头升级建议

### UI — "午夜镜头" 主题

- **冰川蓝色调** — 主色调 `#38BDF8`，摄影感冷色调
- **光圈 Logo** — 6 片光圈叶片 SVG，悬停旋转动效
- **玻璃质感** — 毛玻璃背景、微妙光晕和深度层次
- **DM Sans + JetBrains Mono** — 更有个性的字体组合
- **焦段 Hero 区域** — 仪表盘顶部突出展示焦距分析
- **流畅动效** — GSAP + CSS 驱动：光圈旋转、数字计数、卡片悬停上浮、图表错开入场、拖拽高亮

## 📊 可视化图表

| 图表 | 类型 |
|---|---|
| 焦距分组分布 | 环形图 |
| 详细焦距使用 | 柱状图 |
| 光圈分布 | 横向柱 |
| ISO 分布 | 竖向柱 |
| 相机使用 | 矩形份额 (Treemap) |
| 镜头使用 | 横向条 |
| 拍摄时间线（按月） | 面积图 |
| 每小时拍摄模式 | 24h 径向环 |
| 星期分布 | 雷达图 |
| 文件格式 | 点阵 (Waffle) |
| 照片详情 | 数据表 |

## 🎨 设计系统

| 元素 | 深色主题 | 浅色主题 |
|---|---|---|
| 背景 | `#06080F` 深蓝夜空 | `#F8FAFB` 浅灰白 |
| 主色 | `#38BDF8` 冰川蓝 | `#0369A1` 深冰蓝 |
| 辅助色 | `#3B82F6` 电子蓝 | `#2563EB` 深蓝 |
| 文字 | `#E8ECF1` 高对比白 | `#1A1D26` 深灰黑 |
| 玻璃效果 | `blur(20px)` + 半透明 | 纯白卡片 |

## 🚀 快速启动

```bash
# 1. 克隆项目
git clone <repository-url>
cd PhotoAnalyzer

# 2. 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 启动开发服务器
python start_server.py
# → http://localhost:8765
```

> **注意：** `start_server.py` 默认端口 **8765**，支持热重载。旧文档曾引用 8080 端口，`main.py` 的 `__main__` 使用 8000 — 开发请用 `start_server.py`。

## 📁 项目结构

```
PhotoAnalyzer/
├── backend/
│   ├── main.py              # FastAPI 服务器与 API 端点
│   ├── exif_engine.py       # 多格式 EXIF 提取引擎
│   └── camera_data.json     # 相机裁切系数数据库
├── frontend/
│   ├── index.html           # 仪表板页面
│   ├── styles.css           # "午夜镜头" 设计系统
│   ├── app.js               # 前端逻辑与图表
│   └── vendor/              # ECharts、GSAP、ScrollTrigger（本地）
├── requirements.txt
├── start_server.py          # 开发入口
└── AGENTS.md                # AI 助手指引
```

## 🔧 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | HTML5 + CSS3 + 原生 JavaScript |
| 图表 | Apache ECharts（本地引入） |
| 动画 | GSAP + ScrollTrigger（本地引入） |
| 后端 | FastAPI + Uvicorn |
| EXIF | 多格式引擎：`exif_engine.py`（PIL + rawpy + 可选 pillow-heif） |
| Python | 3.13 |

## 📝 更新日志

### v3.0 — "午夜镜头" 重新设计

- 全新 "午夜镜头" 设计系统
- 相机光圈 SVG Logo
- 焦段分析 Hero 区域
- 玻璃质感 + 辉光效果
- DM Sans + JetBrains Mono 字体
- 3 列等宽图表网格
- 对比度修复（WCAG AA）
- 更丰富交互动效

## 🔑 关键设计决策

> 从 `DESIGN_CHANGES.md` 整理（整合后已删除）。

- **配色演变**：原始紫色 → 琥珀金 `#F0A030` → 当前冰川蓝 `#38BDF8`
- **数据契约**：`/api/analyze` 返回 `{photos, stats, errors, …}`，前端读取 `data.stats.*`。修改 `compute_stats` 字段名会破坏 `app.js`
- **响应式断点**：>1024px 满列 → 768–1024px 两列 → <640px 单列
- **无障碍**：最小字号 11px，上传区域 ARIA 属性，焦点可见状态
- **图表色板**：深色 `['#38BDF8','#0EA5E9','#3B82F6','#06B6D4','#10B981','#F59E0B']`；浅色使用更深变体
- **性能**：进度条使用 `transform: scaleX()` 替代 `width` 避免布局抖动

## ⚠️ 已知问题

- HEIF/HEIC 支持需要 `pillow-heif`，该依赖**未**列入 `requirements.txt`（可选导入，缺失时静默跳过）
- `requirements.txt` 中的 `exif`、`numpy`、`pandas` 实际未被代码使用
- 无 `.gitignore` — `__pycache__`、`.venv`、`.bak` 文件已入库

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

使用、修改或分发本项目时，**必须保留原作者署名**（版权声明和许可证文本）。

---

<a id="english"></a>

# 📷 PhotoLens Analyzer

A web-based photography analysis tool that analyzes photo EXIF data to reveal shooting habits and inform lens upgrade decisions.

## ✨ Features

### Core

- **Multi-format Support** — JPEG, RAW (ARW/CR2/NEF/DNG/ORF/RAF/RW2/PEF, etc.), HEIF/HEIC, TIFF, PNG
- **Drag & Drop Upload** — upload photos or entire folders directly in the browser
- **EXIF Extraction** — focal length, aperture, ISO, shutter speed, camera, lens
- **35mm Equivalent** — auto-converts via camera crop-factor database (`camera_data.json`)
- **Interactive Dashboard** — rich ECharts visualizations
- **Lens Recommendations** — data-driven lens upgrade suggestions

### UI — "Midnight Lens" Theme

- **Glacier Blue Palette** — `#38BDF8` primary accent, photography-inspired cool tones
- **Aperture Logo** — 6-blade SVG with hover-rotate animation
- **Glassmorphism** — frosted-glass backgrounds, subtle glows, depth layers
- **DM Sans + JetBrains Mono** — distinctive font pairing for body & data
- **Focal-Length Hero** — prominent focal-length analysis at dashboard top
- **Rich Animations** — GSAP + CSS driven: aperture spin, number counting, card hover lift, staggered chart entrance, drag-highlight feedback

## 📊 Visualizations

| Chart | Type |
|---|---|
| Focal length groups | Donut |
| Focal length distribution | Bar |
| Aperture distribution | Horizontal bar |
| ISO distribution | Vertical bar |
| Camera usage | Treemap |
| Lens usage | Horizontal bar |
| Monthly timeline | Area |
| Hourly pattern | 24h radial |
| Day of week | Radar |
| File format | Waffle |
| Photo details | Data table |

## 🎨 Design System

| Element | Dark | Light |
|---|---|---|
| Background | `#06080F` deep night | `#F8FAFB` light gray |
| Accent | `#38BDF8` glacier blue | `#0369A1` deep ice blue |
| Secondary | `#3B82F6` electric blue | `#2563EB` deep blue |
| Text | `#E8ECF1` high contrast | `#1A1D26` dark gray |
| Glass | `blur(20px)` + translucent | Pure white cards |

## 🚀 Quick Start

```bash
# 1. Clone
git clone <repository-url>
cd PhotoAnalyzer

# 2. Virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start dev server
python start_server.py
# → http://localhost:8765
```

> **Note:** `start_server.py` runs on port **8765** with auto-reload. Older docs referenced port 8080, and `main.py` `__main__` uses 8000 — use `start_server.py` for development.

## 📁 Project Structure

```
PhotoAnalyzer/
├── backend/
│   ├── main.py              # FastAPI server & API endpoints
│   ├── exif_engine.py       # Multi-format EXIF engine
│   └── camera_data.json     # Crop-factor database
├── frontend/
│   ├── index.html           # Dashboard page
│   ├── styles.css           # "Midnight Lens" design system
│   ├── app.js               # Frontend logic & charts
│   └── vendor/              # ECharts, GSAP, ScrollTrigger (local)
├── requirements.txt
├── start_server.py          # Dev entry point
└── AGENTS.md                # Agent instructions
```

## 🔧 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Charts | Apache ECharts (vendored) |
| Animations | GSAP + ScrollTrigger (vendored) |
| Backend | FastAPI + Uvicorn |
| EXIF | Multi-format engine: `exif_engine.py` (PIL + rawpy + optional pillow-heif) |
| Python | 3.13 |

## 📝 Changelog

### v3.0 — "Midnight Lens" Redesign

- New "Midnight Lens" design system
- Camera aperture SVG logo
- Focal-length analysis hero section
- Glassmorphism + glow effects
- DM Sans + JetBrains Mono fonts
- 3-column equal-width chart grid
- Contrast fixes (WCAG AA)
- Richer interactive animations

## 🔑 Design Decisions

> Condensed from `DESIGN_CHANGES.md` (removed after consolidation).

- **Color evolution**: Original purple → Amber `#F0A030` → current Glacier Blue `#38BDF8`
- **Data contract**: `/api/analyze` returns `{photos, stats, errors, …}`; frontend reads everything from `data.stats.*`. Changing `compute_stats` keys in `main.py` breaks `app.js`.
- **Responsive breakpoints**: >1024px full grid → 768–1024px 2-col → <640px 1-col
- **Accessibility**: Min font 11px, ARIA attributes on upload zone, focus-visible states
- **Chart palettes**: Dark `['#38BDF8','#0EA5E9','#3B82F6','#06B6D4','#10B981','#F59E0B']`; Light uses deeper variants
- **Performance**: Progress bars use `transform: scaleX()` instead of `width` to avoid layout thrash

## ⚠️ Known Issues

- HEIF/HEIC support requires `pillow-heif`, which is **not** in `requirements.txt` (optional import, silently disabled)
- `requirements.txt` lists `exif`, `numpy`, `pandas` which are unused by the code
- No `.gitignore` — `__pycache__`, `.venv`, `.bak` files are committed

## 📄 License

This project is licensed under the [MIT License](LICENSE).

You may use, modify, and distribute this project, but **must retain the original author attribution** (copyright notice and license text).
