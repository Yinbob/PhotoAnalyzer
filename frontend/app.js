/* PhotoAnalyzer - Frontend Logic */

const API_URL = '/api/analyze';
const CHART_COLORS = [
  '#6366f1', '#818cf8', '#a78bfa', '#c084fc',
  '#f472b6', '#fb7185', '#f87171', '#fb923c',
  '#fbbf24', '#a3e635', '#34d399', '#22d3ee',
  '#38bdf8', '#60a5fa', '#93c5fd', '#e879f9'
];

// --- Upload Handling ---
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

const folderInput = document.getElementById('folder-input');
folderInput.addEventListener('change', (e) => {
  // webkitRelativePath gives us the folder name prefix
  const files = Array.from(e.target.files).filter(f => {
    const ext = f.name.toLowerCase().split('.').pop();
    return ['jpg','jpeg','png','tiff','tif','webp','arw','cr2','cr3',
            'nef','orf','raf','rw2','dng','pef','srw','x3f',
            '3fr','ari','bay','cap','iiq','erf','fff','mef','mos',
            'mrw','nrw','ptx','raw','rwl','sr2','srf','kdc','dcr',
            'heif','heic'].includes(ext);
  });
  if (files.length > 0) {
    handleFiles(files);
  } else {
    progressText.textContent = 'No supported image files found in the selected folder.';
    progressText.style.display = 'block';
  }
});

async function handleFiles(files) {
  // Convert FileList to array if needed
  if (files instanceof FileList) files = Array.from(files);
  if (!files || files.length === 0) return;

  progressBar.style.display = 'block';
  progressText.style.display = 'block';
  progressFill.style.width = '0%';
  progressText.textContent = `Preparing ${files.length} files...`;
  uploadZone.style.opacity = '0.5';
  uploadZone.style.pointerEvents = 'none';

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    progressFill.style.width = '30%';
    progressText.textContent = `Analyzing ${files.length} photos...`;

    window._lastFiles = files;
    const resp = await fetch(API_URL, { method: 'POST', body: formData });
    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);

    progressFill.style.width = '90%';
    const data = await resp.json();
    progressFill.style.width = '100%';
    progressText.textContent = `Done! Processed ${data.total_processed} photos.`;

    setTimeout(() => {
      renderDashboard(data);
    }, 400);
  } catch (err) {
    progressText.textContent = `Error: ${err.message}`;
    progressFill.style.width = '0%';
    uploadZone.style.opacity = '1';
    uploadZone.style.pointerEvents = 'auto';
  }
}

function resetApp() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('upload-section').style.display = '';
  progressBar.style.display = 'none';
  progressText.style.display = 'none';
  progressFill.style.width = '0%';
  uploadZone.style.opacity = '1';
  uploadZone.style.pointerEvents = 'auto';
  fileInput.value = '';
  document.getElementById('folder-input').value = '';
  window._lastFiles = null;
  // Dispose all charts
  document.querySelectorAll('.chart').forEach(el => {
    const chart = echarts.getInstanceByDom(el);
    if (chart) chart.dispose();
  });
}

// --- Dashboard Rendering ---
function renderDashboard(data) {
  document.getElementById('upload-section').style.display = 'none';
  document.getElementById('dashboard').style.display = '';

  const s = data.stats;
  document.getElementById('stat-total').textContent = s.total;
  document.getElementById('stat-avg-focal').textContent = s.averages.focal_length + 'mm';
  document.getElementById('stat-avg-aperture').textContent = 'f/' + s.averages.aperture;
  document.getElementById('stat-avg-iso').textContent = s.averages.iso;
  document.getElementById('stat-cameras').textContent = Object.keys(s.cameras || {}).length;
  document.getElementById('stat-lenses').textContent = Object.keys(s.lenses || {}).length;

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
  renderTable(data.photos);
  document.getElementById('table-count').textContent = s.total + ' photos';
}

// --- Chart Renderers ---
function initChart(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const existing = echarts.getInstanceByDom(el);
  if (existing) existing.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });
  window.addEventListener('resize', () => chart.resize());
  return chart;
}

function renderFocalGroupPie(data) {
  const chart = initChart('chart-focal-group');
  if (!chart || !data) return;
  const items = Object.entries(data).map(([name, value]) => ({ name, value }));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: '#8b8fa8', fontSize: 11 } },
    color: CHART_COLORS,
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['50%', '45%'],
      label: { color: '#e8eaf0', fontSize: 11, formatter: '{d}%' },
      data: items,
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
  });
}

function renderFocalBar(data) {
  const chart = initChart('chart-focal-bar');
  if (!chart || !data) return;
  const keys = Object.keys(data).map(Number);
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 20, top: 20, bottom: 60 },
    xAxis: {
      type: 'category', data: keys.map(k => k + 'mm'),
      axisLabel: { color: '#8b8fa8', fontSize: 10, rotate: 45, interval: Math.max(0, Math.floor(keys.length / 20) - 1) },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1c1e2e' } }
    },
    series: [{
      type: 'bar', data: vals, barMaxWidth: 30,
      label: { show: true, position: 'top', color: '#8b8fa8', fontSize: 10 },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#818cf8' }, { offset: 1, color: '#6366f1' }
        ]),
        borderRadius: [3, 3, 0, 0]
      }
    }]
  });
}

function renderApertureChart(data) {
  const chart = initChart('chart-aperture');
  if (!chart || !data) return;
  const keys = Object.keys(data);
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: 'category', data: keys,
      axisLabel: { color: '#8b8fa8', fontSize: 11, rotate: 30 },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1c1e2e' } }
    },
    series: [{
      type: 'bar', data: vals, barMaxWidth: 40,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#22d3ee' }, { offset: 1, color: '#0891b2' }
        ]),
        borderRadius: [3, 3, 0, 0]
      }
    }]
  });
}

function renderISOChart(data) {
  const chart = initChart('chart-iso');
  if (!chart || !data) return;
  const keys = Object.keys(data).map(String);
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: 'category', data: keys,
      axisLabel: { color: '#8b8fa8', fontSize: 11, rotate: 30 },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1c1e2e' } }
    },
    series: [{
      type: 'bar', data: vals, barMaxWidth: 40,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#fbbf24' }, { offset: 1, color: '#d97706' }
        ]),
        borderRadius: [3, 3, 0, 0]
      }
    }]
  });
}

function renderCameraChart(data) {
  const chart = initChart('chart-camera');
  if (!chart || !data) return;
  const items = Object.entries(data).map(([name, value]) => ({ name, value }));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: '#8b8fa8', fontSize: 11 } },
    color: ['#6366f1', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#fb923c', '#a78bfa'],
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['50%', '42%'],
      label: { color: '#e8eaf0', fontSize: 11, formatter: '{d}%' },
      data: items
    }]
  });
}

function renderLensChart(data) {
  const chart = initChart('chart-lens');
  if (!chart || !data) return;
  const items = Object.entries(data).map(([name, value]) => ({ name, value }));
  if (items.length === 0) {
    chart.setOption({
      title: { text: 'No lens data', left: 'center', top: 'center',
        textStyle: { color: '#5c6080', fontSize: 14, fontWeight: 400 } }
    });
    return;
  }
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: '#8b8fa8', fontSize: 11 } },
    color: ['#a78bfa', '#38bdf8', '#fb7185', '#a3e635', '#e879f9', '#93c5fd'],
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['50%', '42%'],
      label: { color: '#e8eaf0', fontSize: 11, formatter: '{d}%' },
      data: items
    }]
  });
}

function renderTimeline(data) {
  const chart = initChart('chart-timeline');
  if (!chart || !data) return;
  const keys = Object.keys(data);
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category', data: keys, boundaryGap: false,
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1c1e2e' } }
    },
    series: [{
      type: 'line', data: vals, smooth: true, symbol: 'circle', symbolSize: 6,
      lineStyle: { color: '#6366f1', width: 2 },
      itemStyle: { color: '#6366f1' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(99,102,241,0.3)' },
          { offset: 1, color: 'rgba(99,102,241,0.02)' }
        ])
      }
    }]
  });
}

function renderHourlyChart(data) {
  const chart = initChart('chart-hourly');
  if (!chart || !data) return;
  const keys = Object.keys(data).map(k => k + ':00');
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: 'category', data: keys,
      axisLabel: { color: '#8b8fa8', fontSize: 10, rotate: 45 },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1c1e2e' } }
    },
    series: [{
      type: 'bar', data: vals, barMaxWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#34d399' }, { offset: 1, color: '#059669' }
        ]),
        borderRadius: [3, 3, 0, 0]
      }
    }]
  });
}

function renderDOWChart(data) {
  const chart = initChart('chart-dow');
  if (!chart || !data) return;
  const keys = Object.keys(data);
  const vals = Object.values(data);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    radar: {
      indicator: keys.map(k => ({ name: k, max: Math.max(...vals, 1) })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#8b8fa8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#2a2d42' } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: '#2a2d42' } }
    },
    series: [{
      type: 'radar',
      data: [{ value: vals, name: 'Photos',
        areaStyle: { color: 'rgba(99,102,241,0.2)' },
        lineStyle: { color: '#6366f1', width: 2 },
        itemStyle: { color: '#6366f1' }
      }]
    }]
  });
}

function renderFormatChart(data) {
  const chart = initChart('chart-format');
  if (!chart || !data) return;
  const items = Object.entries(data).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#8b8fa8', fontSize: 11 } },
    color: ['#6366f1', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#fb923c'],
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '42%'],
      label: { color: '#e8eaf0', fontSize: 11, formatter: '{d}%' },
      data: items
    }]
  });
}

// --- Recommendations ---
function renderRecommendations(recs) {
  const container = document.getElementById('recommendations');
  const list = document.getElementById('recommendations-list');
  if (!recs || recs.length === 0) { container.style.display = 'none'; return; }
  container.style.display = '';
  list.innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="rec-title">${r.title}</div>
      <div class="rec-detail">${r.detail}</div>
      <div class="rec-suggestion">${r.suggestion}</div>
    </div>
  `).join('');
}

// --- Data Table ---
function renderTable(photos) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = photos.map(p => `
    <tr>
      <td title="${p.filename}">${trunc(p.filename, 28)}</td>
      <td>${p.camera_model || '-'}</td>
      <td title="${p.lens_model || ''}">${trunc(p.lens_model || '-', 24)}</td>
      <td class="numeric">${p.focal_length || '-'}</td>
      <td class="numeric">${p.equiv_focal || '-'}</td>
      <td>${p.focal_group || '-'}</td>
      <td class="numeric">${p.aperture ? 'f/' + p.aperture : '-'}</td>
      <td class="numeric">${p.iso || '-'}</td>
      <td class="numeric">${formatShutter(p.exposure_time)}</td>
      <td>${p.date ? p.date.replace(' ', ' ') : '-'}</td>
    </tr>
  `).join('');
}


// --- CSV Export ---
function exportCSV() {
  // Re-upload files for CSV export (reuse stored files if available)
  if (!window._lastFiles || window._lastFiles.length === 0) {
    alert('No photos to export. Please analyze photos first.');
    return;
  }
  const formData = new FormData();
  for (const file of window._lastFiles) {
    formData.append('files', file);
  }
  fetch('/api/export-csv', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (!data.csv) { alert('Export failed'); return; }
      const blob = new Blob(['﻿' + data.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'photoanalysis_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(err => alert('Export error: ' + err.message));
}

function trunc(s, n) { return s && s.length > n ? s.slice(0, n) + '...' : s; }
function formatShutter(t) {
  if (!t) return '-';
  if (t >= 1) return t + 's';
  return '1/' + Math.round(1 / t) + 's';
}
