/* ============================================================
   PhotoLens Analyzer — Frontend Logic (v3)
   "Midnight Lens" Design · Aurora Charts · Better Animations
   ============================================================ */
console.log('[PhotoLens] Script loaded — v3');

const API_URL = '/api/analyze';

/* ============================================================
   1. i18n — Translations
   ============================================================ */
const I18N = {
  en: {
    'nav.upload': 'Upload',
    'nav.dashboard': 'Dashboard',
    'hero.badge': 'Multi-format EXIF Analysis',
    'hero.title': 'Discover your shooting DNA',
    'hero.desc': 'Upload your photos to unlock detailed focal length, aperture, and ISO insights. Supports JPEG, RAW, HEIF, TIFF, PNG.',
    'focalHero.title': 'Focal Length Deep Dive',
    'focalHero.badge': 'Core Insight',
    'focalHero.desc': 'See how you use focal lengths so your next lens choice is data-driven.',
    'feat.exif': 'Deep EXIF Parsing',
    'feat.exif.desc': 'Extracts focal length, aperture, ISO, camera and lens from every file.',
    'feat.dash': 'Visual Dashboard',
    'feat.dash.desc': 'Interactive charts reveal your shooting habits at a glance.',
    'feat.lens': 'Lens Advisor',
    'feat.lens.desc': 'Data-driven recommendations for your next lens upgrade.',
    'upload.drop': 'Drop photos here',
    'upload.or': 'or click to browse',
    'upload.select': 'Select Photos',
    'upload.folder': 'Select Folder',
    'upload.analyzing': 'Analyzing photos...',
    'stat.photos': 'Total Photos',
    'stat.focal': 'Avg Focal Length',
    'stat.aperture': 'Avg Aperture',
    'stat.iso': 'Avg ISO',
    'stat.cameras': 'Camera Bodies',
    'stat.lenses': 'Lenses Used',
    'chart.focalGroup': 'Focal Length Groups',
    'chart.focalGroup.tag': 'distribution',
    'chart.focalBar': 'Focal Length Distribution',
    'chart.focalBar.tag': 'by mm',
    'chart.aperture': 'Aperture Usage',
    'chart.aperture.tag': 'by f-stop',
    'chart.iso': 'ISO Distribution',
    'chart.iso.tag': 'sensitivity',
    'chart.camera': 'Camera Usage',
    'chart.camera.tag': 'by model',
    'chart.lens': 'Lens Usage',
    'chart.lens.tag': 'by model',
    'chart.timeline': 'Shooting Timeline',
    'chart.timeline.tag': 'monthly',
    'chart.hourly': 'Shooting by Hour',
    'chart.hourly.tag': 'time of day',
    'chart.dow': 'Day of Week',
    'chart.dow.tag': 'weekly',
    'chart.format': 'File Format',
    'chart.format.tag': 'by type',
    'recs.title': 'Lens Upgrade Recommendations',
    'recs.ai': 'AI insights',
    'table.title': 'Photo Details',
    'table.search': 'Search photos...',
    'table.th.filename': 'Filename',
    'table.th.camera': 'Camera',
    'table.th.lens': 'Lens',
    'table.th.focal': 'Focal (mm)',
    'table.th.equiv': '35mm Eq',
    'table.th.group': 'Group',
    'table.th.aperture': 'Aperture',
    'table.th.iso': 'ISO',
    'table.th.shutter': 'Shutter',
    'table.th.date': 'Date',
    'action.reset': 'New Analysis',
    'theme.dark': 'Dark',
    'theme.light': 'Light',
    'lang.en': 'EN',
    'lang.zh': '中',
    'error.no_images': 'No supported image files found. Please select JPEG, RAW, HEIF, TIFF, or PNG files.',
    'error.server': 'Server error',
    'upload.preparing': 'Preparing',
    'upload.files': 'files...',
    'upload.analyzing_n': 'Analyzing',
    'upload.photos': 'photos...',
    'upload.done': 'Done!',
    'upload.processed': 'photos processed',
    'upload.exif_fail': 'Unable to extract EXIF data:',
    'photos': 'photos',
  },
  zh: {
    'nav.upload': '上传',
    'nav.dashboard': '数据面板',
    'hero.badge': '多格式 EXIF 分析',
    'hero.title': '发现你的拍摄基因',
    'hero.desc': '上传照片，解锁焦距、光圈和 ISO 的详细洞察。支持 JPEG、RAW、HEIF、TIFF、PNG。',
    'focalHero.title': '焦段深度分析',
    'focalHero.badge': '核心洞察',
    'focalHero.desc': '了解你的镜头焦段使用习惯，为镜头选择提供数据支撑',
    'feat.exif': 'EXIF 深度解析',
    'feat.exif.desc': '精确提取焦距、光圈、ISO 等核心参数',
    'feat.dash': '可视化仪表板',
    'feat.dash.desc': '交互式图表展现你的拍摄习惯',
    'feat.lens': '镜头推荐',
    'feat.lens.desc': '基于数据分析的智能镜头升级建议',
    'upload.drop': '拖放照片到此处',
    'upload.or': '或点击浏览文件',
    'upload.select': '选择照片',
    'upload.folder': '选择文件夹',
    'upload.analyzing': '正在分析照片...',
    'stat.photos': '照片总数',
    'stat.focal': '平均焦距',
    'stat.aperture': '平均光圈',
    'stat.iso': '平均 ISO',
    'stat.cameras': '相机机身',
    'stat.lenses': '使用镜头',
    'chart.focalGroup': '焦距分组',
    'chart.focalGroup.tag': '分布',
    'chart.focalBar': '焦距分布',
    'chart.focalBar.tag': '按毫米',
    'chart.aperture': '光圈使用',
    'chart.aperture.tag': '按 f 档',
    'chart.iso': 'ISO 分布',
    'chart.iso.tag': '感光度',
    'chart.camera': '相机使用',
    'chart.camera.tag': '按型号',
    'chart.lens': '镜头使用',
    'chart.lens.tag': '按型号',
    'chart.timeline': '拍摄时间线',
    'chart.timeline.tag': '按月',
    'chart.hourly': '按小时拍摄分布',
    'chart.hourly.tag': '时段',
    'chart.dow': '星期分布',
    'chart.dow.tag': '按周',
    'chart.format': '文件格式',
    'chart.format.tag': '按类型',
    'recs.title': '镜头升级建议',
    'recs.ai': 'AI 洞察',
    'table.title': '照片详情',
    'table.search': '搜索照片...',
    'table.th.filename': '文件名',
    'table.th.camera': '相机',
    'table.th.lens': '镜头',
    'table.th.focal': '焦距 (mm)',
    'table.th.equiv': '等效焦距',
    'table.th.group': '分组',
    'table.th.aperture': '光圈',
    'table.th.iso': 'ISO',
    'table.th.shutter': '快门',
    'table.th.date': '日期',
    'action.reset': '重新分析',
    'theme.dark': '深色',
    'theme.light': '浅色',
    'lang.en': 'EN',
    'lang.zh': '中',
    'error.no_images': '未找到支持的图片文件。请选择 JPEG、RAW、HEIF、TIFF 或 PNG 格式的文件。',
    'error.server': '服务器错误',
    'upload.preparing': '正在准备',
    'upload.files': '个文件...',
    'upload.analyzing_n': '正在分析',
    'upload.photos': '张照片...',
    'upload.done': '完成！已处理',
    'upload.processed': '张照片',
    'upload.exif_fail': '无法提取EXIF数据:',
    'photos': '张照片',
  }
};

let currentLang = localStorage.getItem('photolens-lang') || 'zh';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.setAttribute('placeholder', val);
    } else {
      el.textContent = val;
    }
  });
  document.documentElement.setAttribute('lang', currentLang);
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('photolens-lang', currentLang);
  applyTranslations();
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = currentLang === 'zh' ? 'EN' : '中';
  refreshAllCharts();
}

/* ============================================================
   2. Theme System
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem('photolens-theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('photolens-theme', next);
  applyTranslations();
  refreshAllCharts();
}

/* ============================================================
   3. Chart Theme Palettes — "Midnight Lens" Sky-Blue
   ============================================================ */
const CHART_PALETTES = {
  dark: {
    colors: ['#60A5FA', '#22D3EE', '#2DD4BF', '#34D399', '#C084FC', '#FB923C', '#FBBF24', '#FDE047'],
    textColor: '#8B95A5',
    labelColor: '#C8CED6',
    legendColor: '#6B7585',
    axisLineColor: 'rgba(255,255,255,0.06)',
    splitLineColor: 'rgba(255,255,255,0.04)',
    tooltipBg: 'rgba(16, 19, 30, 0.92)',
    tooltipBorder: 'rgba(255,255,255,0.08)',
    pieBorderColor: 'rgba(6, 8, 15, 0.8)',
    barGrad1: '#38BDF8',
    barGrad2: '#22D3EE',
    radarAreaColor: 'rgba(56, 189, 248, 0.08)',
    leafLabel: '#0A1220',
    fontFamily: "'DM Sans', sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
  },
  light: {
    colors: ['#2563EB', '#0891B2', '#0D9488', '#059669', '#7C3AED', '#EA580C', '#D97706', '#CA8A04'],
    textColor: '#4A5568',
    labelColor: '#2D3748',
    legendColor: '#718096',
    axisLineColor: 'rgba(0,0,0,0.08)',
    splitLineColor: 'rgba(0,0,0,0.05)',
    tooltipBg: 'rgba(255, 255, 255, 0.96)',
    tooltipBorder: 'rgba(0,0,0,0.08)',
    pieBorderColor: '#ffffff',
    barGrad1: '#0284C7',
    barGrad2: '#0E7490',
    radarAreaColor: 'rgba(3, 105, 161, 0.08)',
    leafLabel: '#FFFFFF',
    fontFamily: "'DM Sans', sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
  }
};

function getChartTheme() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  return CHART_PALETTES[theme];
}

/* ============================================================
   4. Chart Helpers
   ============================================================ */
function initChart(id) {
  const dom = document.getElementById(id);
  if (!dom) return null;
  let chart = echarts.getInstanceByDom(dom);
  if (chart) chart.dispose();
  chart = echarts.init(dom);
  return chart;
}

function tooltipOpts() {
  const th = getChartTheme();
  return {
    backgroundColor: th.tooltipBg,
    borderColor: th.tooltipBorder,
    borderWidth: 1,
    textStyle: { color: th.labelColor, fontSize: 12, fontFamily: th.fontFamily },
    extraCssText: 'backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);'
  };
}

function axisStyle() {
  const th = getChartTheme();
  return {
    axisLine: { lineStyle: { color: th.axisLineColor } },
    axisTick: { show: false },
    axisLabel: { color: th.textColor, fontSize: 11, fontFamily: th.fontFamily },
    splitLine: { lineStyle: { color: th.splitLineColor, type: 'dashed' } }
  };
}

/* ============================================================
   5. Chart Renderers
   ============================================================ */
function renderFocalGroup(data) {
  const chart = initChart('chart-focal-group');
  if (!chart || !data) return;
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} ({d}%)' }),
    legend: { type: 'scroll', bottom: 0, textStyle: { color: th.legendColor, fontSize: 11, fontFamily: th.fontFamily } },
    color: th.colors,
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '44%'],
      label: { color: th.labelColor, fontSize: 11, formatter: '{d}%', fontWeight: 600, fontFamily: th.fontFamily },
      itemStyle: { borderColor: th.pieBorderColor, borderWidth: 2 },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.4)' }, scaleSize: 6 },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: idx => idx * 80,
      data: Object.entries(data).map(([k, v]) => ({ name: k, value: v }))
    }]
  });
}

function renderFocalBar(data) {
  const chart = initChart('chart-focal-bar');
  if (!chart || !data) return;
  const keys = Object.keys(data).map(Number);
  const s = axisStyle();
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: th.radarAreaColor } } }),
    grid: { left: 50, right: 16, top: 16, bottom: 60 },
    xAxis: {
      type: 'category',
      data: keys.map(k => k + 'mm'),
      axisLabel: { color: th.textColor, fontSize: 10, rotate: 45, interval: Math.max(0, Math.floor(keys.length / 18) - 1), fontFamily: th.monoFamily },
      axisLine: s.axisLine
    },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar',
      data: Object.values(data),
      barMaxWidth: 28,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: th.barGrad1 },
          { offset: 1, color: th.barGrad2 }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      animationDelay: idx => idx * 30,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderApertureChart(data) {
  // Horizontal chunky bars (G3 Chunky Bars flavor) - pairs cleanly against vertical ISO
  const chart = initChart('chart-aperture');
  if (!chart || !data) return;
  const th = getChartTheme();
  const entries = Object.entries(data)
    .sort((a, b) => parseFloat(String(a[0]).replace('f/', '')) - parseFloat(String(b[0]).replace('f/', '')));
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    grid: { left: 64, right: 54, top: 12, bottom: 14 },
    xAxis: { type: 'value', ...axisStyle(), splitLine: { show: false } },
    yAxis: {
      type: 'category',
      data: entries.map(e => e[0]),
      axisLabel: { color: th.textColor, fontSize: 11, fontFamily: th.monoFamily },
      axisLine: { lineStyle: { color: th.axisLineColor } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: entries.map(e => e[1]),
      barWidth: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: th.colors[3] },
          { offset: 1, color: th.colors[1] }
        ]),
        borderRadius: [0, 9, 9, 0]
      },
      label: { show: true, position: 'right', color: th.labelColor, fontSize: 11, fontWeight: 600, fontFamily: th.monoFamily, formatter: '{c}' },
      animationDelay: idx => idx * 70,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderISOChart(data) {
  // Vertical rung bars (F1 Rung Bars flavor) - ISO ladder ascending
  const chart = initChart('chart-iso');
  if (!chart || !data) return;
  const s = axisStyle();
  const th = getChartTheme();
  const entries = Object.entries(data).sort((a, b) => Number(a[0]) - Number(b[0]));
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    grid: { left: 44, right: 14, top: 16, bottom: 44 },
    xAxis: {
      type: 'category',
      data: entries.map(e => String(e[0])),
      axisLabel: { color: th.textColor, fontSize: 10, interval: Math.max(0, Math.floor(entries.length / 6) - 1), fontFamily: th.monoFamily },
      axisLine: s.axisLine
    },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar',
      data: entries.map(e => e[1]),
      barMaxWidth: 26,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: th.colors[0] },
          { offset: 1, color: th.colors[2] }
        ]),
        borderRadius: [5, 5, 2, 2]
      },
      animationDelay: idx => idx * 50,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderCameraChart(data) {
  // Nested Treemap single layer (F13) - rectangle area = photos per body
  const chart = initChart('chart-camera');
  if (!chart || !data) return;
  const th = getChartTheme();
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  let children;
  if (entries.length > 12) {
    const top = entries.slice(0, 11);
    const rest = top.length ? entries.slice(11).reduce((sum, e) => sum + e[1], 0) : 0;
    children = top.map((e, i) => ({ name: e[0], value: e[1], itemStyle: { color: th.colors[i % th.colors.length] } }));
    if (rest > 0) children.push({ name: 'Other', value: rest, itemStyle: { color: '#64748B' } });
  } else {
    children = entries.map((e, i) => ({ name: e[0], value: e[1], itemStyle: { color: th.colors[i % th.colors.length] } }));
  }
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { formatter: p => (p.name ? p.name + ': ' + p.value + ' 张' : '') }),
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: { show: true, color: th.leafLabel, fontSize: 11, fontWeight: 700, fontFamily: th.fontFamily, lineHeight: 16 },
      itemStyle: { borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, gapWidth: 2 },
      emphasis: { itemStyle: { borderColor: 'rgba(255,255,255,0.25)' } },
      data: [{ name: 'cameras', children: children }],
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderLensChart(data) {
  // Horizontal thin tick rows (F5 Tick Rows flavor) - each lens one row, thin tick = usage
  const chart = initChart('chart-lens');
  if (!chart || !data) return;
  const th = getChartTheme();
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 12);
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} 张' }),
    grid: { left: 18, right: 58, top: 12, bottom: 12 },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: entries.map(e => e[0]).reverse(),
      axisLabel: { color: th.textColor, fontSize: 11, fontFamily: th.fontFamily, width: 122, overflow: 'truncate' },
      axisLine: { lineStyle: { color: th.axisLineColor } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: entries.map(e => e[1]).reverse(),
      barWidth: 8,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: th.colors[1] },
          { offset: 1, color: th.colors[0] }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      label: { show: true, position: 'right', color: th.labelColor, fontSize: 11, fontFamily: th.monoFamily, formatter: '{c}' },
      animationDelay: idx => idx * 60,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderTimeline(data) {
  const chart = initChart('chart-timeline');
  if (!chart || !data) return;
  const s = axisStyle();
  const th = getChartTheme();
  const areaTop = hexToRgba(th.colors[0], 0.25);
  const keys = Object.keys(data);
  const labels = keys.map(k => formatMonthLabel(k));
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis' }),
    grid: { left: 50, right: 16, top: 16, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: th.textColor, fontSize: 10, fontFamily: th.monoFamily },
      axisLine: s.axisLine
    },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'line',
      data: Object.values(data),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: th.colors[0], width: 2 },
      itemStyle: { color: th.colors[0] },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: areaTop },
          { offset: 1, color: 'rgba(0,0,0,0)' }
        ])
      },
      animationDuration: 1200,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderHourlyChart(data) {
  // 24h radial ring (L10 Radial Patchwork flavor) - hour = angle, bar length = photos
  const chart = initChart('chart-hourly');
  if (!chart || !data) return;
  const th = getChartTheme();
  const vals = Array.from({ length: 24 }, (_, i) => data[i] || 0);
  const max = Math.max.apply(null, vals.concat([1]));
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { formatter: p => p.name + ' 时: ' + p.value + ' 张' }),
    polar: { radius: ['20%', '80%'], center: ['50%', '54%'] },
    angleAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => i),
      startAngle: 90,
      axisLabel: { color: th.textColor, fontSize: 9, fontFamily: th.monoFamily, interval: 2, formatter: v => v + 'h' },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    radiusAxis: {
      type: 'value',
      min: 0,
      max: Math.round(max * 1.2) || 1,
      axisLabel: { show: false },
      splitLine: { lineStyle: { color: th.splitLineColor, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: vals,
      coordinateSystem: 'polar',
      barWidth: '62%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: th.colors[0] },
          { offset: 1, color: th.colors[2] }
        ]),
        borderRadius: 3
      },
      animationDelay: idx => idx * 18,
      animationDuration: 900,
      animationEasing: 'cubicOut'
    }]
  });
}

function renderDOWChart(data) {
  const chart = initChart('chart-dow');
  if (!chart || !data) return;
  const th = getChartTheme();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const vals = days.map(d => data[d] || 0);
  chart.setOption({
    tooltip: Object.assign(tooltipOpts()),
    radar: {
      indicator: days.map(d => ({ name: d, max: Math.max.apply(null, vals.concat([0])) * 1.2 || 10 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: th.textColor, fontSize: 11, fontFamily: th.fontFamily },
      splitLine: { lineStyle: { color: th.splitLineColor } },
      splitArea: { show: true, areaStyle: { color: ['rgba(0,0,0,0)', 'rgba(255,255,255,0.02)'] } },
      axisLine: { lineStyle: { color: th.axisLineColor } }
    },
    series: [{
      type: 'radar',
      data: [{ value: vals }],
      areaStyle: { color: th.radarAreaColor },
      lineStyle: { color: th.colors[0], width: 2 },
      itemStyle: { color: th.colors[0] },
      animationDuration: 800
    }]
  });
}

function renderFormatChart(data) {
  // Dot waffle (G4 Dot Waffle flavor) - 100 dots, one dot = ~1% share
  const el = document.getElementById('chart-format');
  if (!el || !data) return;
  const th = getChartTheme();
  const inst = echarts.getInstanceByDom(el);
  if (inst) inst.dispose();
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total = entries.reduce((sum, e) => sum + e[1], 0);
  if (!total) return;
  const cells = [];
  const percents = entries.map((e, i) => ({
    name: e[0], count: e[1],
    rem: Math.max(1, Math.round(e[1] / total * 100)),
    color: th.colors[i % th.colors.length]
  }));
  let ci = 0;
  for (let i = 0; i < 100; i++) {
    while (ci < percents.length - 1 && percents[ci].rem <= 0) ci++;
    if (ci < percents.length && percents[ci].rem > 0) {
      cells.push(percents[ci].color);
      percents[ci].rem--;
    } else {
      cells.push('rgba(125,140,165,0.10)');
    }
  }
  const wrap = document.createElement('div');
  wrap.className = 'format-waffle';
  const grid = document.createElement('div');
  grid.className = 'format-waffle__grid';
  cells.forEach(color => {
    const d = document.createElement('span');
    d.className = 'format-waffle__dot';
    d.style.background = color;
    grid.appendChild(d);
  });
  const legend = document.createElement('div');
  legend.className = 'format-waffle__legend';
  percents.forEach((e, i) => {
    const l = document.createElement('span');
    l.className = 'format-waffle__item';
    l.innerHTML = '<i style="background:' + th.colors[i % th.colors.length] + '"></i>' + escapeHtml(e.name) + ' ' + e.count;
    legend.appendChild(l);
  });
  wrap.appendChild(grid);
  wrap.appendChild(legend);
  el.innerHTML = '';
  el.appendChild(wrap);
}

/* ============================================================
   6. Render Dashboard
   ============================================================ */
let _lastDashboardData = null;

function renderDashboard(data) {
  _lastDashboardData = data;
  const stats = data && data.stats ? data.stats : {};
  const avgs = stats.averages || {};

  // Animate stat numbers
  animateNumber('stat-total', data.total_processed || 0);
  animateNumber('stat-avg-focal', avgs.focal_length, ' mm');
  animateNumber('stat-avg-aperture', avgs.aperture, '', 'f/');
  animateNumber('stat-avg-iso', avgs.iso);
  animateNumber('stat-cameras', Object.keys(stats.cameras || {}).length);
  animateNumber('stat-lenses', Object.keys(stats.lenses || {}).length);

  // Render charts
  if (stats.focal_groups) renderFocalGroup(stats.focal_groups);
  if (stats.focal_dist) renderFocalBar(stats.focal_dist);
  if (stats.aperture_dist) renderApertureChart(stats.aperture_dist);
  if (stats.iso_dist) renderISOChart(stats.iso_dist);
  if (stats.cameras) renderCameraChart(stats.cameras);
  if (stats.lenses) renderLensChart(stats.lenses);
  if (stats.monthly) renderTimeline(stats.monthly);
  if (stats.hourly) renderHourlyChart(stats.hourly);
  if (stats.dow) renderDOWChart(stats.dow);
  if (stats.formats) renderFormatChart(stats.formats);

  // Recommendations
  renderRecommendations(stats.recommendations || []);

  // Data table
  if (data.photos && data.photos.length > 0) {
    renderTable(data.photos);
  }
}

/* ============================================================
   7. Animated Number Counter
   ============================================================ */
function animateNumber(id, value, suffix = '', prefix = '') {
  const el = document.getElementById(id);
  if (!el || value === undefined || value === null) return;

  const target = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(target)) {
    el.textContent = value;
    return;
  }

  const duration = 1200;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;

    if (Number.isInteger(target)) {
      el.textContent = prefix + Math.round(current) + suffix;
    } else {
      el.textContent = prefix + current.toFixed(1) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   8. Recommendations Renderer
   ============================================================ */
function renderRecommendations(recs) {
  const container = document.getElementById('recommendations');
  const list = document.getElementById('recommendations-list');
  if (!container || !list) return;

  if (!recs || recs.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  list.innerHTML = '';

  recs.forEach(rec => {
    const item = document.createElement('div');
    item.className = 'recs-item';
    item.innerHTML = `
      <div class="recs-item__icon">🔭</div>
      <div class="recs-item__body">
        <div class="recs-item__title">${escapeHtml(rec.title || '')}</div>
        <div class="recs-item__desc">${escapeHtml(rec.detail || '')}</div>
        ${rec.suggestion ? `<div class="recs-item__hint">${escapeHtml(rec.suggestion)}</div>` : ''}
      </div>
    `;
    list.appendChild(item);
  });
}

/* ============================================================
   9. Data Table
   ============================================================ */
let _allPhotos = [];

function renderTable(photos) {
  _allPhotos = photos;
  const tbody = document.getElementById('table-body');
  const countEl = document.getElementById('table-count');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (countEl) countEl.textContent = photos.length + ' photos';

  photos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td title="${escapeHtml(p.filename)}">${escapeHtml(truncate(p.filename, 24))}</td>
      <td>${escapeHtml(p.camera_model || '-')}</td>
      <td title="${escapeHtml(p.lens_model)}">${escapeHtml(truncate(p.lens_model, 20) || '-')}</td>
      <td class="mono">${p.focal_length || '-'}</td>
      <td class="mono">${p.equiv_focal || '-'}</td>
      <td>${escapeHtml(p.focal_group || '-')}</td>
      <td class="mono">${p.aperture ? 'f/' + p.aperture : '-'}</td>
      <td class="mono">${p.iso || '-'}</td>
      <td class="mono">${formatShutter(p.exposure_time)}</td>
      <td class="mono">${formatDate(p.date)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterTable(query) {
  if (!_allPhotos.length) return;
  const q = query.toLowerCase().trim();
  const filtered = q ? _allPhotos.filter(p =>
    (p.filename && p.filename.toLowerCase().includes(q)) ||
    (p.camera_model && p.camera_model.toLowerCase().includes(q)) ||
    (p.lens_model && p.lens_model.toLowerCase().includes(q)) ||
    (p.focal_group && p.focal_group.toLowerCase().includes(q)) ||
    String(p.equiv_focal || '').includes(q)
  ) : _allPhotos;
  renderTable(filtered);
}

/* ============================================================
   10. Utility Functions
   ============================================================ */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function formatShutter(t) {
  if (!t) return '-';
  if (t >= 1) return t + 's';
  return '1/' + Math.round(1 / t) + 's';
}

function formatMonthLabel(k) {
  const s = String(k);
  return /^\d{4}:\d{2}$/.test(s) ? s.replace(':', '-') : s;
}

function formatDate(v) {
  if (!v) return '-';
  const s = String(v);
  return /^\d{4}:\d{2}:\d{2}/.test(s) ? s.slice(0, 10).replace(/:/g, '-') : s.slice(0, 10);
}

function hexToRgba(hex, alpha) {
  if (!hex || hex.charAt(0) !== '#') return hex;
  const m = hex.replace('#', '');
  const n = m.length === 3
    ? m.split('').map(ch => ch + ch).join('')
    : m;
  const num = parseInt(n, 16);
  return 'rgba(' + ((num >> 16) & 255) + ',' +
    ((num >> 8) & 255) + ',' + (num & 255) + ',' + alpha + ')';
}

function isImageFile(file) {
  const ok = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
    'image/heif', 'image/heic', 'image/tiff', 'image/svg+xml'
  ];
  if (ok.includes(file.type)) return true;
  const ext = file.name.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heif', 'heic', 'tiff', 'tif',
    'arw', 'cr2', 'cr3', 'nef', 'orf', 'raf', 'rw2', 'dng', 'pef'].includes(ext);
}

/* ============================================================
   11. View Management
   ============================================================ */
function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('nav-btn--active'));

  const targetView = document.getElementById('view-' + view);
  if (targetView) targetView.classList.add('view--active');

  const targetBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (targetBtn) targetBtn.classList.add('nav-btn--active');

  // Re-render charts when switching to dashboard
  if (view === 'dashboard' && _lastDashboardData) {
    setTimeout(() => refreshAllCharts(), 100);
  }
}

function refreshAllCharts() {
  if (!_lastDashboardData) return;
  renderDashboard(_lastDashboardData);
}

/* ============================================================
   12. Initialization
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  applyTranslations();

  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');
  const btnFiles = document.getElementById('btn-select-files');
  const btnFolder = document.getElementById('btn-select-folder');
  const progressBar = document.getElementById('upload-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPct = document.getElementById('progress-pct');

  /* ── Upload Zone Events ── */
  if (uploadZone) {
    uploadZone.addEventListener('click', (e) => {
      if (e.target.closest('.upload-actions')) return;
      fileInput.click();
    });

    uploadZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) handleFiles(Array.from(fileInput.files));
    });
  }

  if (folderInput) {
    folderInput.addEventListener('change', () => {
      if (folderInput.files.length) handleFiles(Array.from(folderInput.files));
    });
  }

  if (btnFiles) {
    btnFiles.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (btnFolder) {
    btnFolder.addEventListener('click', (e) => {
      e.stopPropagation();
      folderInput.click();
    });
  }

  /* ── Read Directory Entries ── */
  async function readEntries(entries) {
    const files = [];
    for (const entry of entries) {
      if (entry.isFile) {
        const f = await new Promise(r => entry.file(r));
        files.push(f);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const subEntries = await new Promise(r => reader.readEntries(r));
        const subFiles = await readEntries(subEntries);
        files.push(...subFiles);
      }
    }
    return files;
  }

  /* ── Handle Files ── */
  async function handleFiles(allFiles) {
    console.log('[PhotoLens] handleFiles called with', allFiles.length, 'files');

    const files = allFiles.filter(f => {
      const ok = isImageFile(f);
      if (!ok) console.log('[PhotoLens] Skipping non-image:', f.name, f.type);
      return ok;
    });

    console.log('[PhotoLens] Image files after filter:', files.length);

    if (files.length === 0) {
      alert(t('error.no_images'));
      return;
    }

    // Show progress
    if (progressBar) progressBar.classList.add('is-visible');
    if (progressFill) progressFill.style.transform = 'scaleX(0)';
    if (progressText) progressText.textContent = t('upload.preparing') + ' ' + files.length + ' ' + t('upload.files');
    if (progressPct) progressPct.textContent = '0%';

    // Disable zone
    if (uploadZone) {
      uploadZone.style.opacity = '0.4';
      uploadZone.style.pointerEvents = 'none';
    }

    // Build FormData
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    // Simulate progress
    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + Math.random() * 15, 85);
      if (progressFill) progressFill.style.transform = "scaleX(" + (pct/100) + ")";
      if (progressPct) progressPct.textContent = Math.round(pct) + '%';
    }, 300);

    if (progressText) progressText.textContent = t('upload.analyzing_n') + ' ' + files.length + ' ' + t('upload.photos');

    try {
      console.log('[PhotoLens] Sending request to', API_URL);
      const resp = await fetch(API_URL, { method: 'POST', body: formData });
      console.log('[PhotoLens] Response status:', resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(t('error.server') + ' (' + resp.status + '): ' + errText);
      }

      const data = await resp.json();
      console.log('[PhotoLens] Analysis complete:', data.total_processed, 'photos');

      clearInterval(interval);
      if (progressFill) progressFill.style.transform = 'scaleX(1)';
      if (progressPct) progressPct.textContent = '100%';
      if (progressText) progressText.textContent = t('upload.done') + ' ' + data.total_processed + ' ' + t('upload.processed');

      setTimeout(() => {
        if (data.total_processed === 0 && data.errors && data.errors.length > 0) {
          if (progressText) progressText.textContent = t('upload.exif_fail') + ' ' + data.errors.join(', ');
          if (progressFill) progressFill.style.transform = 'scaleX(0)';
          if (progressPct) progressPct.textContent = '0%';
          if (uploadZone) {
            uploadZone.style.opacity = '1';
            uploadZone.style.pointerEvents = 'auto';
          }
          return;
        }
        renderDashboard(data);
        const navDash = document.getElementById('nav-dashboard');
        if (navDash) navDash.style.display = '';
        showView('dashboard');
        if (uploadZone) {
          uploadZone.style.opacity = '1';
          uploadZone.style.pointerEvents = 'auto';
        }
      }, 600);

    } catch (err) {
      console.error('[PhotoLens] Upload error:', err);
      clearInterval(interval);
      if (progressText) progressText.textContent = 'Error: ' + err.message;
      if (progressFill) progressFill.style.transform = 'scaleX(0)';
      if (progressPct) progressPct.textContent = '0%';
      if (uploadZone) {
        uploadZone.style.opacity = '1';
        uploadZone.style.pointerEvents = 'auto';
      }
    }
  }

  /* ── Reset App ── */
  window.resetApp = function() {
    const navDash = document.getElementById('nav-dashboard');
    if (navDash) navDash.style.display = 'none';
    if (progressBar) progressBar.classList.remove('is-visible');
    if (progressFill) progressFill.style.transform = 'scaleX(0)';
    if (uploadZone) {
      uploadZone.style.opacity = '1';
      uploadZone.style.pointerEvents = 'auto';
    }
    if (fileInput) fileInput.value = '';
    _lastDashboardData = null;
    document.querySelectorAll('.chart').forEach(el => {
      const c = echarts.getInstanceByDom(el);
      if (c) c.dispose();
    });
    showView('upload');
  };

  /* ── Upload zone entrance animation ── */
  if (uploadZone) {
    uploadZone.style.opacity = '0';
    uploadZone.style.transform = 'translateY(24px)';
    setTimeout(() => {
      uploadZone.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      uploadZone.style.opacity = '1';
      uploadZone.style.transform = 'translateY(0)';
    }, 300);
  }

  console.log('[PhotoLens] Initialization complete');
});
