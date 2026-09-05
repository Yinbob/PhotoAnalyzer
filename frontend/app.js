/* ============================================================
   PhotoLens Analyzer — Frontend Logic (v2)
   Theme Toggle · i18n · Lieflat Charts · Full Dashboard
   ============================================================ */
console.log('[PhotoLens] Script loaded — v2');

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
  // Update lang label to show opposite language
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
   3. Chart Theme Palettes (Lieflat-charts style)
   ============================================================ */
const CHART_PALETTES = {
  dark: {
    colors: ['#7C3AED','#6366F1','#3B82F6','#06B6D4','#22C55E','#F59E0B','#EC4899','#F43F5E','#8B5CF6','#14B8A6','#F97316','#84CC16'],
    textColor: '#94a3b8',
    axisLineColor: 'rgba(255,255,255,0.1)',
    splitLineColor: 'rgba(255,255,255,0.06)',
    tooltipBg: 'rgba(15,23,42,0.95)',
    tooltipBorder: 'rgba(255,255,255,0.1)',
    tooltipText: '#f1f5f9',
    bgColor: 'transparent',
    labelColor: '#f1f5f9',
    legendColor: '#94a3b8',
    pieBorderColor: '#111827',
    lineColor1: '#14B8A6',
    lineColor2: '#22C55E',
    barGrad1: '#34d399',
    barGrad2: '#10b981',
    radarAreaColor: 'rgba(16,185,129,0.15)',
    radarLineColor: '#10b981',
    radarItemColor: '#10b981',
    radarBorderColor: '#111827',
  },
  light: {
    colors: ['#7C3AED','#6366F1','#2563EB','#0891B2','#16A34A','#D97706','#DB2777','#E11D48','#7C3AED','#0D9488','#EA580C','#65A30D'],
    textColor: '#475569',
    axisLineColor: 'rgba(0,0,0,0.1)',
    splitLineColor: 'rgba(0,0,0,0.06)',
    tooltipBg: 'rgba(255,255,255,0.98)',
    tooltipBorder: 'rgba(0,0,0,0.1)',
    tooltipText: '#1e293b',
    bgColor: 'transparent',
    labelColor: '#1e293b',
    legendColor: '#475569',
    pieBorderColor: '#f8fafc',
    lineColor1: '#0D9488',
    lineColor2: '#16A34A',
    barGrad1: '#6ee7b7',
    barGrad2: '#10b981',
    radarAreaColor: 'rgba(16,185,129,0.12)',
    radarLineColor: '#0D9488',
    radarItemColor: '#0D9488',
    radarBorderColor: '#e2e8f0',
  }
};

function getChartTheme() {
  const mode = document.documentElement.getAttribute('data-theme') || 'dark';
  return CHART_PALETTES[mode] || CHART_PALETTES.dark;
}

/* ============================================================
   4. Shared Utilities
   ============================================================ */
const IMAGE_EXTS = [
  '.jpg','.jpeg','.png','.gif','.bmp','.webp','.tiff','.tif',
  '.heic','.heif','.arw','.cr2','.cr3','.nef','.orf','.raf',
  '.rw2','.dng','.pef','.svg'
];

function isImageFile(file) {
  const name = (file.name || '').toLowerCase();
  if (IMAGE_EXTS.some(ext => name.endsWith(ext))) return true;
  if (file.type && file.type.startsWith('image/')) return true;
  return false;
}

function trunc(s, n) { return s && s.length > n ? s.slice(0, n) + '...' : s; }

function formatShutter(t) {
  if (!t) return '-';
  if (t >= 1) return t + 's';
  return '1/' + Math.round(1/t) + 's';
}

/* ============================================================
   5. Chart Initialisation Helper
   ============================================================ */
let _lastDashboardData = null; // store for re-renders

function initChart(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const existing = echarts.getInstanceByDom(el);
  if (existing) existing.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });
  new ResizeObserver(() => chart.resize()).observe(el);
  return chart;
}

function axisStyle() {
  const th = getChartTheme();
  return {
    axisLabel: { color: th.textColor, fontSize: 11 },
    axisLine: { lineStyle: { color: th.axisLineColor } },
    splitLine: { lineStyle: { color: th.splitLineColor } },
  };
}

function tooltipOpts(extra) {
  const th = getChartTheme();
  return Object.assign({
    backgroundColor: th.tooltipBg,
    borderColor: th.tooltipBorder,
    textStyle: { color: th.tooltipText, fontSize: 12 }
  }, extra || {});
}

/* ============================================================
   6. Chart Renderers — all use getChartTheme()
   ============================================================ */
function renderFocalGroupPie(data) {
  const chart = initChart('chart-focal-group');
  if (!chart || !data) return;
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} ({d}%)' }),
    legend: { type: 'scroll', bottom: 0, textStyle: { color: th.legendColor, fontSize: 11 } },
    color: th.colors,
    series: [{
      type: 'pie', radius: ['38%','68%'], center: ['50%','44%'],
      label: { color: th.labelColor, fontSize: 11, formatter: '{d}%', fontWeight: 500 },
      itemStyle: { borderColor: th.pieBorderColor, borderWidth: 2 },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.5)' }, scaleSize: 6 },
      animationType: 'scale', animationEasing: 'elasticOut',
      animationDelay: idx => idx * 80,
      data: Object.entries(data).map(([k,v]) => ({name:k,value:v}))
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
    xAxis: { type: 'category', data: keys.map(k => k+'mm'), axisLabel: { color: th.textColor, fontSize: 10, rotate: 45, interval: Math.max(0, Math.floor(keys.length/18)-1) }, axisLine: s.axisLine },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar', data: Object.values(data), barMaxWidth: 28,
      itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:th.barGrad1},{offset:1,color:th.barGrad2}]), borderRadius: [4,4,0,0] },
      animationDelay: idx => idx*30, animationDuration: 800, animationEasing: 'cubicOut'
    }]
  });
}

function renderApertureChart(data) {
  const chart = initChart('chart-aperture');
  if (!chart || !data) return;
  const s = axisStyle();
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    grid: { left: 50, right: 16, top: 16, bottom: 50 },
    xAxis: { type: 'category', data: Object.keys(data), axisLabel: { color: th.textColor, fontSize: 11, rotate: 30 }, axisLine: s.axisLine },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar', data: Object.values(data), barMaxWidth: 36,
      itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:th.colors[5]},{offset:1,color:th.colors[4]}]), borderRadius: [4,4,0,0] },
      animationDuration: 800, animationEasing: 'cubicOut'
    }]
  });
}

function renderISOChart(data) {
  const chart = initChart('chart-iso');
  if (!chart || !data) return;
  const s = axisStyle();
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    grid: { left: 50, right: 16, top: 16, bottom: 50 },
    xAxis: { type: 'category', data: Object.keys(data).map(String), axisLabel: { color: th.textColor, fontSize: 11, rotate: 30 }, axisLine: s.axisLine },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar', data: Object.values(data), barMaxWidth: 36,
      itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:th.colors[7]},{offset:1,color:th.colors[6]}]), borderRadius: [4,4,0,0] },
      animationDuration: 800, animationEasing: 'cubicOut'
    }]
  });
}

function renderCameraChart(data) {
  const chart = initChart('chart-camera');
  if (!chart || !data) return;
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} ({d}%)' }),
    legend: { type: 'scroll', bottom: 0, textStyle: { color: th.legendColor, fontSize: 11 } },
    color: th.colors,
    series: [{
      type: 'pie', radius: ['38%','68%'], center: ['50%','44%'],
      label: { color: th.labelColor, fontSize: 11, formatter: '{d}%', fontWeight: 500 },
      itemStyle: { borderColor: th.pieBorderColor, borderWidth: 2 },
      animationType: 'scale', animationEasing: 'elasticOut',
      data: Object.entries(data).map(([k,v]) => ({name:k,value:v}))
    }]
  });
}

function renderLensChart(data) {
  const chart = initChart('chart-lens');
  if (!chart || !data) return;
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} ({d}%)' }),
    legend: { type: 'scroll', bottom: 0, textStyle: { color: th.legendColor, fontSize: 11 } },
    color: th.colors.slice().reverse(),
    series: [{
      type: 'pie', radius: ['38%','68%'], center: ['50%','44%'],
      label: { color: th.labelColor, fontSize: 11, formatter: '{d}%', fontWeight: 500 },
      itemStyle: { borderColor: th.pieBorderColor, borderWidth: 2 },
      animationType: 'scale', animationEasing: 'elasticOut',
      data: Object.entries(data).map(([k,v]) => ({name:k,value:v}))
    }]
  });
}

function renderTimeline(data) {
  const chart = initChart('chart-timeline');
  if (!chart || !data) return;
  const keys = Object.keys(data);
  const s = axisStyle();
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis' }),
    grid: { left: 50, right: 16, top: 16, bottom: 40 },
    xAxis: { type: 'category', data: keys, axisLabel: { color: th.textColor, fontSize: 10, rotate: 30 }, axisLine: s.axisLine },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'line', data: Object.values(data), smooth: true,
      lineStyle: { color: th.lineColor1, width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:th.radarAreaColor},{offset:1,color:'rgba(16,185,129,0)'}]) },
      itemStyle: { color: th.lineColor1 },
      animationDuration: 1200, animationEasing: 'cubicOut'
    }]
  });
}

function renderHourlyChart(data) {
  const chart = initChart('chart-hourly');
  if (!chart || !data) return;
  const s = axisStyle();
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    grid: { left: 50, right: 16, top: 16, bottom: 40 },
    xAxis: { type: 'category', data: Object.keys(data), axisLabel: { color: th.textColor, fontSize: 10 }, axisLine: s.axisLine },
    yAxis: { type: 'value', ...s },
    series: [{
      type: 'bar', data: Object.values(data), barMaxWidth: 20,
      itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:th.colors[2]},{offset:1,color:th.colors[3]}]), borderRadius: [3,3,0,0] },
      animationDuration: 800, animationEasing: 'cubicOut'
    }]
  });
}

function renderDOWChart(data) {
  const chart = initChart('chart-dow');
  if (!chart || !data) return;
  const keys = Object.keys(data);
  const vals = Object.values(data);
  const th = getChartTheme();
  chart.setOption({
    tooltip: tooltipOpts(),
    radar: {
      indicator: keys.map(k => ({ name: k, max: Math.max(...vals,1)*1.1 })),
      shape: 'polygon', splitNumber: 4,
      axisName: { color: th.textColor, fontSize: 11, fontWeight: 500 },
      splitLine: { lineStyle: { color: th.axisLineColor } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: th.axisLineColor } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: vals, name: t('stat.photos'),
        areaStyle: { color: th.radarAreaColor },
        lineStyle: { color: th.radarLineColor, width: 2 },
        itemStyle: { color: th.radarItemColor, borderColor: th.radarBorderColor, borderWidth: 2 },
        symbol: 'circle', symbolSize: 6
      }],
      animationDuration: 1000, animationEasing: 'cubicOut'
    }]
  });
}

function renderFormatChart(data) {
  const chart = initChart('chart-format');
  if (!chart || !data) return;
  const th = getChartTheme();
  chart.setOption({
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: '{b}: {c} ({d}%)' }),
    legend: { bottom: 0, textStyle: { color: th.legendColor, fontSize: 11 } },
    color: th.colors.slice(0, 6),
    series: [{
      type: 'pie', radius: ['42%','68%'], center: ['50%','42%'],
      label: { color: th.labelColor, fontSize: 11, formatter: '{d}%', fontWeight: 500 },
      itemStyle: { borderColor: th.pieBorderColor, borderWidth: 2 },
      animationType: 'scale', animationEasing: 'elasticOut',
      data: Object.entries(data).map(([k,v]) => ({name:k.toUpperCase(),value:v}))
    }]
  });
}

/* ============================================================
   7. refreshAllCharts — re-render on theme/language change
   ============================================================ */
function refreshAllCharts() {
  if (!_lastDashboardData) return;
  const s = _lastDashboardData.stats || {};
  renderFocalGroupPie(s.focal_groups);
  renderFocalBar(s.focal_dist);
  renderApertureChart(s.aperture_dist);
  renderISOChart(s.iso_dist);
  renderCameraChart(s.cameras);
  renderLensChart(s.lenses);
  renderTimeline(s.monthly);
  renderHourlyChart(s.hourly);
  renderDOWChart(s.dow);
  renderFormatChart(s.formats);
}

/* ============================================================
   8. Recommendations
   ============================================================ */
function renderRecommendations(recs) {
  const container = document.getElementById('recommendations');
  const list = document.getElementById('recommendations-list');
  if (!container || !list) return;
  if (!recs || recs.length === 0) { container.style.display = 'none'; return; }
  container.style.display = '';
  list.innerHTML = recs.map(r =>
    '<div class="rec-item">' +
      '<div class="rec-title">' + r.title + '</div>' +
      '<div class="rec-detail">' + r.detail + '</div>' +
      '<div class="rec-suggestion">' + r.suggestion + '</div>' +
    '</div>'
  ).join('');
}

/* ============================================================
   9. Data Table
   ============================================================ */
let allPhotos = [];

function renderTable(photos) {
  allPhotos = photos;
  const tbody = document.getElementById('table-body');
  if (!tbody) return;
  tbody.innerHTML = photos.map(p =>
    '<tr>' +
      '<td title="' + p.filename + '">' + trunc(p.filename, 28) + '</td>' +
      '<td>' + (p.camera_model || '-') + '</td>' +
      '<td title="' + (p.lens_model || '') + '">' + trunc(p.lens_model || '-', 24) + '</td>' +
      '<td class="numeric">' + (p.focal_length || '-') + '</td>' +
      '<td class="numeric">' + (p.equiv_focal || '-') + '</td>' +
      '<td>' + (p.focal_group || '-') + '</td>' +
      '<td class="numeric">' + (p.aperture ? 'f/' + p.aperture : '-') + '</td>' +
      '<td class="numeric">' + (p.iso || '-') + '</td>' +
      '<td class="numeric">' + formatShutter(p.exposure_time) + '</td>' +
      '<td>' + (p.date ? p.date.replace(' ', ' ') : '-') + '</td>' +
    '</tr>'
  ).join('');
}

window.filterTable = function(query) {
  if (!query) return renderTable(allPhotos);
  const q = query.toLowerCase();
  const filtered = allPhotos.filter(p =>
    (p.filename||'').toLowerCase().includes(q) ||
    (p.camera_model||'').toLowerCase().includes(q) ||
    (p.lens_model||'').toLowerCase().includes(q) ||
    (p.focal_group||'').toLowerCase().includes(q) ||
    String(p.equiv_focal||'').includes(q) ||
    String(p.iso||'').includes(q)
  );
  const tbody = document.getElementById('table-body');
  const tc = document.getElementById('table-count');
  if (tc) tc.textContent = filtered.length + ' ' + t('photos');
  if (tbody) tbody.innerHTML = filtered.map(p =>
    '<tr>' +
      '<td title="' + p.filename + '">' + trunc(p.filename, 28) + '</td>' +
      '<td>' + (p.camera_model || '-') + '</td>' +
      '<td title="' + (p.lens_model || '') + '">' + trunc(p.lens_model || '-', 24) + '</td>' +
      '<td class="numeric">' + (p.focal_length || '-') + '</td>' +
      '<td class="numeric">' + (p.equiv_focal || '-') + '</td>' +
      '<td>' + (p.focal_group || '-') + '</td>' +
      '<td class="numeric">' + (p.aperture ? 'f/' + p.aperture : '-') + '</td>' +
      '<td class="numeric">' + (p.iso || '-') + '</td>' +
      '<td class="numeric">' + formatShutter(p.exposure_time) + '</td>' +
      '<td>' + (p.date ? p.date.replace(' ', ' ') : '-') + '</td>' +
    '</tr>'
  ).join('');
};

/* ============================================================
   10. View Management
   ============================================================ */
window.showView = function(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  const target = document.getElementById('view-' + view);
  if (target) target.classList.add('view--active');
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('nav-btn--active', btn.dataset.view === view);
  });
  if (view === 'dashboard') {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      animateDashboard();
    }, 100);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ============================================================
   11. Dashboard Rendering
   ============================================================ */
window.renderDashboard = function(data) {
  _lastDashboardData = data; // cache for theme re-renders
  const s = data.stats || {};
  const avgs = s.averages || {};
  setText('stat-total', s.total || 0);
  setText('stat-avg-focal', avgs.focal_length ? (avgs.focal_length + 'mm') : '-');
  setText('stat-avg-aperture', avgs.aperture ? ('f/' + avgs.aperture) : '-');
  setText('stat-avg-iso', avgs.iso || '-');
  setText('stat-cameras', Object.keys(s.cameras || {}).length);
  setText('stat-lenses', Object.keys(s.lenses || {}).length);

  renderFocalGroupPie(s.focal_groups);
  renderFocalBar(s.focal_dist);
  renderApertureChart(s.aperture_dist);
  renderISOChart(s.iso_dist);
  renderCameraChart(s.cameras);
  renderLensChart(s.lenses);
  renderTimeline(s.monthly);
  renderHourlyChart(s.hourly);
  renderDOWChart(s.dow);
  renderFormatChart(s.formats);
  renderRecommendations(s.recommendations);
  renderTable(data.photos || []);
  const tc = document.getElementById('table-count');
  if (tc) tc.textContent = (s.total || 0) + ' ' + t('photos');
};

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ============================================================
   12. Animations
   ============================================================ */
function animateDashboard() {
  document.querySelectorAll('[data-stat]').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 60);
  });
  setTimeout(animateCounters, 300);
}

function animateCounters() {
  document.querySelectorAll('.stat-card__value').forEach(el => {
    const raw = el.textContent.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    if (isNaN(num) || num === 0) return;
    const suffix = el.textContent.replace(/[0-9.]/g, '').trim();
    const isFloat = raw.includes('.');
    const decimals = isFloat ? raw.split('.')[1].length : 0;
    const obj = { val: 0 };
    const start = performance.now();
    const duration = 1000;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      obj.val = num * ease;
      el.textContent = isFloat ? obj.val.toFixed(decimals) + suffix : Math.round(obj.val) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ============================================================
   13. DOMContentLoaded — Init, Upload, Drag & Drop
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[PhotoLens] DOM ready, initializing...');

  /* ── Theme & i18n Init ── */
  initTheme();
  applyTranslations();
  // Set initial lang label
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = currentLang === 'zh' ? 'EN' : '中';

  /* ── Theme & lang toggles already in HTML ── */
  const headerControls = document.getElementById('header-controls');
  if (headerControls) {
    headerControls.style.display = 'flex';
  }

  /* ── Element References ── */
  const uploadZone    = document.getElementById('upload-zone');
  const fileInput     = document.getElementById('file-input');
  const folderInput   = document.getElementById('folder-input');
  const progressBar   = document.getElementById('upload-progress');
  const progressFill  = document.getElementById('progress-fill');
  const progressText  = document.getElementById('progress-text');
  const progressPct   = document.getElementById('progress-pct');
  const btnFiles      = document.getElementById('btn-select-files');
  const btnFolder     = document.getElementById('btn-select-folder');

  if (!uploadZone) console.error('[PhotoLens] #upload-zone not found');
  if (!fileInput)  console.error('[PhotoLens] #file-input not found');
  if (!progressBar) console.error('[PhotoLens] #upload-progress not found');

  /* ── Upload Zone Click ── */
  if (uploadZone) {
    uploadZone.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('.upload-actions')) return;
      console.log('[PhotoLens] Zone clicked, opening file dialog');
      if (fileInput) fileInput.click();
    });
  }

  /* ── Select Photos Button ── */
  if (btnFiles) {
    btnFiles.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[PhotoLens] Select Photos clicked');
      if (fileInput) fileInput.click();
    });
  }

  /* ── Select Folder Button ── */
  if (btnFolder) {
    btnFolder.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[PhotoLens] Select Folder clicked');
      if (folderInput) folderInput.click();
      else if (fileInput) fileInput.click();
    });
  }

  /* ── File Input Change ── */
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      console.log('[PhotoLens] file-input change event, files:', e.target.files.length);
      handleFiles(Array.from(e.target.files));
      this.value = '';
    });
  }

  /* ── Folder Input Change ── */
  if (folderInput) {
    folderInput.addEventListener('change', function(e) {
      console.log('[PhotoLens] folder-input change event, files:', e.target.files.length);
      handleFiles(Array.from(e.target.files));
      this.value = '';
    });
  }

  /* ── Drag & Drop ── */
  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove('drag-over');
      console.log('[PhotoLens] Files dropped');
      const items = e.dataTransfer.items;
      if (items && items.length > 0) {
        const entries = [];
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
          if (entry) entries.push(entry);
        }
        if (entries.length > 0) {
          readEntries(entries).then(files => handleFiles(files));
          return;
        }
      }
      handleFiles(Array.from(e.dataTransfer.files));
    });
  }

  /* ── Recursively read directory entries ── */
  function readEntries(entries) {
    return new Promise(async (resolve) => {
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
      resolve(files);
    });
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
    if (progressFill) progressFill.style.width = '0%';
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
      if (progressFill) progressFill.style.width = pct + '%';
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
      if (progressFill) progressFill.style.width = '100%';
      if (progressPct) progressPct.textContent = '100%';
      if (progressText) progressText.textContent = t('upload.done') + ' ' + data.total_processed + ' ' + t('upload.processed');

      setTimeout(() => {
        if (data.total_processed === 0 && data.errors && data.errors.length > 0) {
          if (progressText) progressText.textContent = t('upload.exif_fail') + ' ' + data.errors.join(', ');
          if (progressFill) progressFill.style.width = '0%';
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
      if (progressFill) progressFill.style.width = '0%';
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
    if (progressFill) progressFill.style.width = '0%';
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
