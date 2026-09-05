# PhotoLens Analyzer - 照片镜头分析器

一款基于 Web 的摄影分析工具，通过分析照片的 EXIF 数据，帮助您了解拍摄习惯，为镜头升级决策提供数据支持。


## ✨ 功能特性

### 核心功能
- **多格式支持** - JPEG、RAW（ARW/CR2/NEF/DNG/ORF/RAF/RW2/PEF）、HEIF/HEIC、TIFF、PNG
- **拖拽上传** - 在浏览器中直接拖拽上传照片
- **EXIF 提取** - 自动读取焦距、光圈、ISO、快门速度、相机和镜头信息
- **35mm 等效焦距** - 根据相机裁切系数数据库自动转换为 35mm 等效焦距
- **交互式仪表板** - 基于 ECharts 的丰富可视化图表
- **镜头推荐** - 智能镜头升级建议

### UI 设计（玻璃态风格）
- **现代玻璃效果** - 透明卡片、模糊背景和精致边框
- **专业配色方案** - 深色背景搭配绿色强调色
- **Fira 字体** - Fira Sans（正文）+ Fira Code（数据），提升可读性
- **流畅动画** - GSAP 驱动的动画效果：
  - 页面进入动画
  - 卡片悬停效果
  - 数字计数动画
  - 进度条动画
  - 滚动触发动画

## 📊 可视化图表

- 焦距分组分布（饼图）
- 详细焦距使用情况（柱状图）
- 光圈分布
- ISO 分布
- 相机和镜头使用统计
- 拍摄时间线（按月）
- 每小时拍摄模式
- 星期几拍摄分布（雷达图）
- 文件格式分布
- 照片详细数据表格

## 🚀 快速启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd PhotoAnalyzer
```

### 2. 创建虚拟环境

```bash
# 创建虚拟环境
python3 -m venv .venv

# 激活虚拟环境
# macOS/Linux:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 启动服务器

```bash
python -c "
from backend.main import app
import uvicorn
uvicorn.run(app, host='0.0.0.0', port=8080)
"
```

### 5. 打开浏览器

访问 [http://localhost:8080](http://localhost:8080)

### 6. 上传照片

拖拽照片到上传区域，或点击"选择照片"按钮选择文件。仪表板将自动更新您的拍摄统计数据。

## 📁 项目结构

```
PhotoAnalyzer/
├── backend/
│   ├── main.py              # FastAPI 服务器和 API 端点
│   ├── exif_engine.py       # 多格式 EXIF 提取引擎
│   └── camera_data.json     # 相机裁切系数数据库
├── frontend/
│   ├── index.html           # 仪表板页面
│   ├── styles.css           # 玻璃态深色主题样式
│   ├── app.js               # 前端逻辑和 ECharts 可视化
│   └── vendor/              # 第三方库（ECharts、GSAP）
├── FocalLengthAnalyzer/     # 相关项目（原始版本）
├── requirements.txt         # Python 依赖
└── README.md
```

## 🔌 API 接口

### `POST /api/analyze`

上传照片进行分析。

**请求：** `multipart/form-data`，`files` 字段包含图片文件。

**响应：**
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

导出分析结果为 CSV 文件。

## 📷 支持的相机品牌

该工具包含全面的相机裁切系数数据库，支持：

- **索尼** - A7/A9/A1 系列（全画幅）、A6000/A6700 系列（APS-C）
- **佳能** - EOS R1/R3/R5/R6/R8（全画幅）、R7/R10/R50（APS-C）、5D/6D/1D 系列
- **尼康** - Z5/Z6/Z7/Z8/Z9（全画幅）、Z30/Z50（APS-C）、D 系列
- **富士** - X-H/X-T/X-Pro/X-E 系列（APS-C）、X100 系列
- **奥林巴斯/OM System** - OM-1/OM-5/E-M 系列（M43）
- **松下** - S 系列（全画幅）、GH/G/GX 系列（M43）
- **徕卡** - SL/Q/M 系列
- **哈苏** - X/X2D 系列
- **大疆** - Mavic/Air/Mini 系列
- **理光** - GR III/GR IIIx

## 🛠 技术栈

- **后端：** Python 3.13、FastAPI、Pillow、exif、rawpy、pillow-heif、pandas
- **前端：** HTML5、CSS3、JavaScript、ECharts 5、GSAP 3
- **设计：** 玻璃态深色主题、响应式布局、拖拽上传

## 🎯 浏览器兼容性

- ✅ Chrome 76+
- ✅ Firefox 72+
- ✅ Safari 13+
- ✅ Edge 79+

## 📱 响应式设计

- ✅ 桌面设备（1440px+）
- ✅ 平板设备（768px-1023px）
- ✅ 手机设备（<768px）




