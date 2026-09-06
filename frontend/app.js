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
    'action.close': 'Close',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    'nav.manage': 'Data Management',
    'scope.current': 'Current Upload',
    'scope.all': 'All Photos',
    'scope.collection': 'Current Collection',
    'dashboard.range': 'Stats Collection',
    'auth.login.title': 'Sign in to Data Management',
    'auth.login.desc': 'Historical photos and collections are protected by the management password.',
    'auth.setup.title': 'Set Management Password',
    'auth.setup.desc': 'Choose a password of at least 8 characters. It protects stored history, not normal analysis.',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm New Password',
    'auth.current_password': 'Current Password',
    'auth.new_password': 'New Password',
    'auth.confirm_new_password': 'Confirm New Password',
    'auth.login': 'Sign In',
    'auth.setup': 'Set Password',
    'auth.logout': 'Sign Out',
    'auth.change_saved': 'Password updated.',
    'auth.error.confirm': 'Passwords do not match.',
    'auth.error.minimum': 'Use at least 8 characters.',
    'auth.error.invalid': 'Incorrect management password.',
    'upload.target': 'Save to Collection',
    'upload.target.authenticated': 'Uploaded metadata will enter the selected collection.',
    'upload.target.ungrouped': 'Uploaded metadata will enter Ungrouped.',
    'upload.persistence': 'Saved {saved}. Duplicates {duplicates}. Failed {failed}.',
    'upload.collection_saved': 'Saved to {name}.',
    'collection.all_photos': 'All Photos',
    'collection.ungrouped': 'Ungrouped',
    'collection.recycle_bin': 'Recycle Bin',
    'collection.new': 'New Collection',
    'collection.edit': 'Edit Collection',
    'collection.name': 'Name',
    'collection.description': 'Description',
    'collection.color': 'Color Tag',
    'collection.deleted_notice': 'Deleting a collection does not delete its photos; it only removes membership.',
    'collection.batch': 'Save Upload Batch',
    'collection.batch.action': 'Create from Batch',
    'collection.batch.empty': 'No upload batches yet.',
    'manage.title': 'Data Management',
    'manage.change_password': 'Change Password',
    'manage.summary': '{photos} photos · {collections} collections',
    'manage.search': 'Search',
    'manage.search.placeholder': 'Filename, camera, lens...',
    'manage.camera': 'Camera',
    'manage.lens': 'Lens',
    'manage.format': 'Format',
    'manage.date_from': 'From Date',
    'manage.date_to': 'To Date',
    'manage.sort': 'Sort',
    'manage.sort.date': 'Capture Date',
    'manage.sort.filename': 'Filename',
    'manage.sort.camera': 'Camera',
    'manage.sort.iso': 'ISO',
    'manage.order': 'Order',
    'manage.order.asc': 'Ascending',
    'manage.order.desc': 'Descending',
    'manage.reset': 'Reset',
    'manage.all': 'All',
    'manage.add_to': 'Add to Collection',
    'manage.remove_from': 'Remove from Collection',
    'manage.apply': 'Apply',
    'manage.delete_selected': 'Delete Selected',
    'manage.restore_selected': 'Restore Selected',
    'manage.purge': 'Empty Recycle Bin',
    'manage.select_all': 'Select all',
    'manage.prev_page': 'Previous page',
    'manage.next_page': 'Next page',
    'manage.page': 'Page {page} of {pages}',
    'manage.th.format': 'Format',
    'manage.th.collections': 'Collections',
    'manage.th.actions': 'Actions',
    'manage.edit': 'Edit',
    'manage.delete_photo': 'Delete Photo',
    'manage.restore_photo': 'Restore',
    'manage.save': 'Save Changes',
    'manage.type_delete': 'Type DELETE to confirm',
    'manage.confirm_delete_photo': 'Move this photo to the recycle bin?',
    'manage.confirm_bulk_delete': 'Move the selected photos to the recycle bin?',
    'manage.confirm_bulk_restore': 'Restore the selected photos?',
    'manage.confirm_collection_delete': 'Delete this collection?',
    'manage.confirm_purge': 'Permanently delete all photos in the recycle bin?',
    'manage.saved': 'Changes saved.',
    'manage.deleted': 'Moved to recycle bin.',
    'manage.restored': 'Photos restored.',
    'manage.purged': 'Recycle bin emptied.',
    'manage.collection_saved': 'Collection saved.',
    'manage.collection_deleted': 'Collection deleted.',
    'manage.empty.title': 'No photo data yet',
    'manage.empty.desc': 'Uploaded photos accumulate here as EXIF records.',
    'manage.empty.action': 'Upload Photos',
    'manage.loading': 'Loading data...',
    'manage.no_selection': 'Select photos first.',
    'manage.selected': '{count} selected',
    'manage.ready': 'Signed in.',
    'manage.locked': 'Too many failed attempts. Try again later.',
    'manage.bulk.updated': 'Collection membership updated.',
    'manage.error': 'The request failed. Please try again.',
    'photo.edit': 'Edit Photo Data',
    'photo.file_info': 'File Information',
    'photo.file_size': 'File Size',
    'photo.content_hash': 'Content Hash',
    'photo.capture_info': 'Capture Information',
    'photo.captured_at': 'Capture Time',
    'photo.parameters': 'Capture Parameters',
    'photo.calculated_equiv': 'Calculated 35mm Eq',
    'photo.collections': 'Collection Memberships',
    'photo.add_collection': 'Add Membership',
    'photo.remove_collection': 'Remove',
    'photo.membership_removed': 'Membership removed.',
    'history.login_required': 'Sign in to use historical photo statistics.',
    'history.no_data': 'No photo data in this scope yet.',
    'confirm.title': 'Confirm Action',
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
    'upload.db_error': 'Metadata could not be saved. Please check the server.',
    'collection.batch.created': 'Batch collection created.',
    'chart.photos_unit': ' photos',
    'chart.hour_label': 'h',
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
    'action.close': '关闭',
    'action.cancel': '取消',
    'action.confirm': '确认',
    'nav.manage': '数据管理',
    'scope.current': '本次上传',
    'scope.all': '全部照片',
    'scope.collection': '当前合集',
    'dashboard.range': '分析合集',
    'auth.login.title': '登录数据管理',
    'auth.login.desc': '历史照片和合集数据受管理密码保护。',
    'auth.setup.title': '设置管理密码',
    'auth.setup.desc': '设置至少 8 位密码，用于保护历史数据，不阻断普通分析。',
    'auth.password': '密码',
    'auth.confirm_password': '确认新密码',
    'auth.current_password': '当前密码',
    'auth.new_password': '新密码',
    'auth.confirm_new_password': '确认新密码',
    'auth.login': '登录',
    'auth.setup': '设置密码',
    'auth.logout': '退出登录',
    'auth.change_saved': '密码已更新。',
    'auth.error.confirm': '两次输入的密码不一致。',
    'auth.error.minimum': '密码至少需要 8 位。',
    'auth.error.invalid': '管理密码不正确。',
    'upload.target': '保存到合集',
    'upload.target.authenticated': '上传后元数据会进入所选合集。',
    'upload.target.ungrouped': '上传后元数据会进入未分组。',
    'upload.persistence': '新增 {saved} 张，重复 {duplicates} 张，失败 {failed} 张。',
    'upload.collection_saved': '已保存到“{name}”。',
    'collection.all_photos': '全部照片',
    'collection.ungrouped': '未分组',
    'collection.recycle_bin': '回收站',
    'collection.new': '新建合集',
    'collection.edit': '编辑合集',
    'collection.name': '名称',
    'collection.description': '描述',
    'collection.color': '颜色标识',
    'collection.deleted_notice': '删除合集不会删除其中的照片，只是解除归属关系。',
    'collection.batch': '保存上传批次',
    'collection.batch.action': '从批次创建',
    'collection.batch.empty': '暂无上传批次。',
    'manage.title': '数据管理',
    'manage.change_password': '修改密码',
    'manage.summary': '{photos} 张照片 · {collections} 个合集',
    'manage.search': '搜索',
    'manage.search.placeholder': '文件名、相机、镜头...',
    'manage.camera': '相机',
    'manage.lens': '镜头',
    'manage.format': '格式',
    'manage.date_from': '开始日期',
    'manage.date_to': '结束日期',
    'manage.sort': '排序',
    'manage.sort.date': '拍摄时间',
    'manage.sort.filename': '文件名',
    'manage.sort.camera': '相机',
    'manage.sort.iso': 'ISO',
    'manage.order': '顺序',
    'manage.order.asc': '升序',
    'manage.order.desc': '降序',
    'manage.reset': '重置',
    'manage.all': '全部',
    'manage.add_to': '加入合集',
    'manage.remove_from': '移出合集',
    'manage.apply': '应用',
    'manage.delete_selected': '删除所选',
    'manage.restore_selected': '恢复所选',
    'manage.purge': '清空回收站',
    'manage.select_all': '全选',
    'manage.prev_page': '上一页',
    'manage.next_page': '下一页',
    'manage.page': '第 {page} / {pages} 页',
    'manage.th.format': '格式',
    'manage.th.collections': '合集',
    'manage.th.actions': '操作',
    'manage.edit': '编辑',
    'manage.delete_photo': '删除照片',
    'manage.restore_photo': '恢复',
    'manage.save': '保存修改',
    'manage.type_delete': '输入 DELETE 确认',
    'manage.confirm_delete_photo': '将这张照片移入回收站？',
    'manage.confirm_bulk_delete': '将所选照片移入回收站？',
    'manage.confirm_bulk_restore': '恢复所选照片？',
    'manage.confirm_collection_delete': '删除这个合集？',
    'manage.confirm_purge': '彻底删除回收站中的全部照片？',
    'manage.saved': '修改已保存。',
    'manage.deleted': '已移入回收站。',
    'manage.restored': '照片已恢复。',
    'manage.purged': '回收站已清空。',
    'manage.collection_saved': '合集已保存。',
    'manage.collection_deleted': '合集已删除。',
    'manage.empty.title': '暂无照片数据',
    'manage.empty.desc': '上传照片后，EXIF 数据会自动累积到这里。',
    'manage.empty.action': '去上传照片',
    'manage.loading': '正在载入数据...',
    'manage.no_selection': '请先选择照片。',
    'manage.selected': '已选择 {count} 张',
    'manage.ready': '登录成功。',
    'manage.locked': '失败次数过多，请稍后再试。',
    'manage.bulk.updated': '合集归属已更新。',
    'manage.error': '请求失败，请重试。',
    'photo.edit': '编辑照片数据',
    'photo.file_info': '文件信息',
    'photo.file_size': '文件大小',
    'photo.content_hash': '内容哈希',
    'photo.capture_info': '拍摄信息',
    'photo.captured_at': '拍摄时间',
    'photo.parameters': '拍摄参数',
    'photo.calculated_equiv': '计算等效焦距',
    'photo.collections': '合集归属',
    'photo.add_collection': '加入合集',
    'photo.remove_collection': '移出',
    'photo.membership_removed': '已移出合集。',
    'history.login_required': '登录后才能使用历史照片统计。',
    'history.no_data': '当前范围还没有照片数据。',
    'confirm.title': '确认操作',
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
    'upload.db_error': '元数据保存失败，请检查服务器。',
    'collection.batch.created': '批次合集已创建。',
    'chart.photos_unit': '张',
    'chart.hour_label': '时',
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
    el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.documentElement.setAttribute('lang', currentLang);
  document.querySelectorAll('.field select').forEach(select => {
    const first = select.querySelector('option[value=""]');
    if (first && first.dataset.i18nAll === '1') first.textContent = t('manage.all');
  });
  renderUploadTarget();
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('photolens-lang', currentLang);
  applyTranslations();
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = currentLang === 'zh' ? 'EN' : '中';
  renderAuthPanel();
  if (authState.authenticated) {
    renderCollectionList();
    renderCollectionPickers();
    renderPhotoRows();
    renderDashboardControls();
  }
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
    tooltip: Object.assign(tooltipOpts(), { formatter: p => (p.name ? p.name + ': ' + p.value + t('chart.photos_unit') : '') }),
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
    tooltip: Object.assign(tooltipOpts(), { trigger: 'item', formatter: p => p.name + ': ' + p.value + t('chart.photos_unit') }),
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
    tooltip: Object.assign(tooltipOpts(), { formatter: p => p.name + t('chart.hour_label') + ': ' + p.value + t('chart.photos_unit') }),
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
   11a. Data Management State and API Helpers
   ============================================================ */
const authState = { configured: false, authenticated: false };
const collections = [];
const photoOptions = { cameras: [], lenses: [], formats: [] };
let batches = [];
const manageFilters = {
  collectionId: 'all', q: '', camera: '', lens: '', format: '',
  dateFrom: '', dateTo: '', deleted: false, sort: 'captured_at',
  order: 'desc', limit: 50, offset: 0,
};
let managePhotos = [];
let manageTotal = 0;
const selectedPhotoIds = new Set();
let currentPhoto = null;
let pendingBatchId = null;
let managementInitialized = false;
let summary = { active_photos: 0, deleted_photos: 0, ungrouped_photos: 0, collections: 0 };
let dashboardScope = 'current';
let dashboardCollectionId = null;

function applyTemplate(key, vars = {}) {
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    t(key),
  );
}

async function apiJson(url, options = {}) {
  const config = { credentials: 'same-origin', ...options };
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
    config.headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  }
  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    throw { status: 0, message: t('manage.error') };
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }
  if (!response.ok) {
    if (response.status === 401) {
      authState.authenticated = false;
      renderAuthPanel();
      renderUploadTarget();
    }
    throw {
      status: response.status,
      message: payload && payload.detail ? payload.detail : t('manage.error'),
    };
  }
  return payload;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `app-toast is-visible app-toast--${type}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.className = 'app-toast';
  }, 3800);
}

function confirmDialog(options = {}) {
  return new Promise(resolve => {
    const dialog = document.getElementById('confirm-dialog');
    const title = document.getElementById('confirm-title');
    const message = document.getElementById('confirm-message');
    const textGroup = document.getElementById('confirm-text-group');
    const input = document.getElementById('confirm-text');
    const button = document.getElementById('btn-confirm-action');
    const cancel = document.getElementById('btn-cancel-confirm');
    const form = dialog.querySelector('form');
    if (!dialog || !message || !button) return resolve(false);

    title.textContent = options.title || t('confirm.title');
    message.textContent = options.message || '';
    textGroup.hidden = !options.requireDelete;
    input.value = '';
    button.disabled = Boolean(options.requireDelete);
    const submit = event => {
      event.preventDefault();
      close();
      resolve(!options.requireDelete || input.value === 'DELETE');
    };
    const close = () => {
      form.removeEventListener('submit', submit);
      cancel.removeEventListener('click', close);
      input.removeEventListener('input', validate);
      if (dialog.open) dialog.close();
    };
    const validate = () => {
      button.disabled = input.value !== 'DELETE';
    };
    form.addEventListener('submit', submit);
    cancel.addEventListener('click', close);
    input.addEventListener('input', validate);
    dialog.showModal();
    if (options.requireDelete) input.focus();
  });
}

function formatDateTimeValue(value) {
  if (!value) return '';
  return String(value).slice(0, 19);
}

function formatDateTimeDisplay(value) {
  if (!value) return '-';
  return formatDateTimeValue(value).replace('T', ' ');
}

function formatFileSize(size) {
  const bytes = Number(size || 0);
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function populateSelect(select, values, selected = '', allText = '') {
  if (!select) return;
  const firstText = allText || t('manage.all');
  select.innerHTML = `<option value="">${escapeHtml(firstText)}</option>`;
  values.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    option.selected = String(item.value) === String(selected);
    select.appendChild(option);
  });
}

function getCollectionById(id) {
  return collections.find(item => String(item.id) === String(id));
}

/* ============================================================
   11b. Management Authentication
   ============================================================ */
function renderAuthPanel() {
  const authPanel = document.getElementById('manage-auth');
  const manageApp = document.getElementById('manage-app');
  const title = document.getElementById('auth-title');
  const description = document.getElementById('auth-description');
  const confirmGroup = document.getElementById('confirm-password-group');
  const passwordLabel = document.getElementById('auth-password-label');
  const submit = document.getElementById('auth-submit');
  const passwordInput = document.getElementById('auth-password');
  const toggle = document.getElementById('auth-toggle');

  if (!authState.authenticated) {
    if (authPanel) authPanel.hidden = false;
    if (manageApp) manageApp.hidden = true;
    if (confirmGroup) confirmGroup.hidden = authState.configured;
    if (title) title.textContent = t(authState.configured ? 'auth.login.title' : 'auth.setup.title');
    if (description) description.textContent = t(authState.configured ? 'auth.login.desc' : 'auth.setup.desc');
    if (passwordLabel) passwordLabel.textContent = t(authState.configured ? 'auth.password' : 'auth.new_password');
    if (submit) submit.textContent = t(authState.configured ? 'auth.login' : 'auth.setup');
    if (passwordInput) passwordInput.setAttribute('autocomplete', authState.configured ? 'current-password' : 'new-password');
  } else if (authPanel && manageApp) {
    authPanel.hidden = true;
    manageApp.hidden = false;
  }

  if (toggle) {
    toggle.classList.toggle('is-authenticated', authState.authenticated);
  }
}

function setAuthError(message = '') {
  const error = document.getElementById('auth-error');
  if (error) error.textContent = message;
}

async function syncManagementView() {
  try {
    const status = await fetch('/api/auth/status', { credentials: 'same-origin' })
      .then(response => response.json());
    authState.configured = Boolean(status.configured);
    authState.authenticated = Boolean(status.authenticated);
  } catch (error) {
    authState.configured = false;
    authState.authenticated = false;
  }
  renderAuthPanel();
  renderUploadTarget();
  if (authState.authenticated && !managementInitialized) {
    managementInitialized = true;
    await loadManagementData();
  } else if (authState.authenticated) {
    await loadManagementData();
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  setAuthError();
  const password = document.getElementById('auth-password').value;
  const confirm = document.getElementById('auth-confirm-password').value;
  if (!authState.configured) {
    if (password.length < 8) return setAuthError(t('auth.error.minimum'));
    if (password !== confirm) return setAuthError(t('auth.error.confirm'));
  }
  const submit = document.getElementById('auth-submit');
  submit.disabled = true;
  try {
    const endpoint = authState.configured ? '/api/auth/login' : '/api/auth/setup';
    await apiJson(endpoint, { method: 'POST', body: { password } });
    authState.configured = true;
    authState.authenticated = true;
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-confirm-password').value = '';
    renderAuthPanel();
    renderUploadTarget();
    showToast(t('manage.ready'));
    managementInitialized = false;
    await syncManagementView();
  } catch (error) {
    setAuthError(error.status === 429 ? t('manage.locked') : t('auth.error.invalid'));
  } finally {
    submit.disabled = false;
  }
}

async function logout() {
  await apiJson('/api/auth/logout', { method: 'POST' });
  authState.authenticated = false;
  managementInitialized = false;
  selectedPhotoIds.clear();
  renderAuthPanel();
  renderUploadTarget();
  showToast(t('auth.logout'));
}

async function changePassword(event) {
  event.preventDefault();
  const dialog = document.getElementById('password-dialog');
  const form = document.getElementById('password-form');
  const current = document.getElementById('current-password').value;
  const next = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-new-password').value;
  if (next.length < 8) {
    showToast(t('auth.error.minimum'), 'error');
    return;
  }
  if (next !== confirm) {
    showToast(t('auth.error.confirm'), 'error');
    return;
  }
  try {
    await apiJson('/api/auth/change-password', {
      method: 'POST',
      body: { current_password: current, new_password: next },
    });
    form.reset();
    dialog.close();
    showToast(t('auth.change_saved'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

/* ============================================================
   11c. Collections and Photo Lists
   ============================================================ */
async function loadManagementData() {
  await Promise.all([
    refreshSummary(),
    loadCollections(),
    loadPhotoOptions(),
    loadBatches(),
  ]);
  await loadPhotos();
}

async function refreshSummary() {
  try {
    summary = await apiJson('/api/photos/summary');
  } catch (error) {
    return;
  }
  const element = document.getElementById('manage-summary');
  if (element) {
    element.textContent = applyTemplate('manage.summary', {
      photos: summary.active_photos,
      collections: summary.collections,
    });
  }
}

async function loadCollections() {
  const payload = await apiJson('/api/collections');
  collections.length = 0;
  payload.collections.forEach(item => collections.push(item));
  renderCollectionList();
  renderCollectionPickers();
}

function renderCollectionList() {
  const list = document.getElementById('collection-list');
  if (!list) return;
  list.innerHTML = '';
  const specials = [
    { id: 'all', name: t('collection.all_photos'), count: summary.active_photos, recent: null },
    { id: 'none', name: t('collection.ungrouped'), count: summary.ungrouped_photos, recent: null },
    { id: 'recycle', name: t('collection.recycle_bin'), count: summary.deleted_photos, recent: null },
  ];

  specials.forEach(item => {
    const button = document.createElement('div');
    button.className = 'collection-item';
    button.type = 'button';
    button.dataset.id = item.id;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.classList.toggle('is-active', manageFilters.collectionId === item.id);
    button.innerHTML = `
      <span class="collection-item__name">${escapeHtml(item.name)}</span>
      <span class="collection-item__meta"><strong>${item.count}</strong></span>
    `;
    button.addEventListener('click', () => selectScope(item.id));
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectScope(item.id);
      }
    });
    list.appendChild(button);
  });

  collections.forEach(collection => {
    const button = document.createElement('div');
    button.className = 'collection-item';
    button.type = 'button';
    button.dataset.id = collection.id;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.classList.toggle('is-active', String(manageFilters.collectionId) === String(collection.id));
    if (collection.color) button.style.setProperty('--collection-color', collection.color);
    const recent = collection.latest_captured_at ? formatDateTimeDisplay(collection.latest_captured_at).slice(0, 10) : '';
    button.innerHTML = `
      <span class="collection-item__name">
        <i></i>${escapeHtml(collection.name)}
      </span>
      ${collection.description ? `<span class="collection-item__desc">${escapeHtml(collection.description)}</span>` : ''}
      <span class="collection-item__meta">
        <strong>${collection.photo_count}</strong>
        ${recent ? `<span>${escapeHtml(recent)}</span>` : ''}
      </span>
      <span class="collection-item__actions">
        <button class="icon-button" type="button" data-action="edit" title="${escapeHtml(t('collection.edit'))}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
        <button class="icon-button icon-button--danger" type="button" data-action="delete" title="${escapeHtml(t('manage.delete_photo'))}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></svg></button>
      </span>
    `;
    button.addEventListener('click', event => {
      const action = event.target.closest('[data-action]');
      if (action) {
        event.stopPropagation();
        if (action.dataset.action === 'edit') openCollectionDialog(collection);
        else deleteCollection(collection);
        return;
      }
      selectScope(collection.id);
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectScope(collection.id);
      }
    });
    list.appendChild(button);
  });
}

function renderCollectionPickers() {
  const values = collections.map(item => ({ value: item.id, label: item.name }));
  const selected = String(manageFilters.collectionId === 'all' || manageFilters.collectionId === 'none' ? '' : manageFilters.collectionId);
  populateSelect(document.getElementById('bulk-add-collection'), values, selected, t('manage.all'));
  populateSelect(document.getElementById('bulk-remove-collection'), values, selected, t('manage.all'));
  populateSelect(document.getElementById('dashboard-collection'), values, dashboardCollectionId, t('manage.all'));
  populateSelect(document.getElementById('drawer-add-collection'), values, '', t('manage.all'));
  renderUploadTarget();
  renderDashboardControls();
}

function renderDashboardControls() {
  const row = document.getElementById('dashboard-collection-row');
  const select = document.getElementById('dashboard-collection');
  const button = document.getElementById('scope-collection-button');
  const hasCollection = Boolean(dashboardCollectionId && getCollectionById(dashboardCollectionId));
  if (row) row.hidden = !authState.authenticated;
  if (button) button.disabled = !authState.authenticated || !hasCollection;
  if (select && dashboardCollectionId) select.value = String(dashboardCollectionId);
}

function selectScope(scope) {
  manageFilters.collectionId = scope;
  manageFilters.offset = 0;
  selectedPhotoIds.clear();
  renderCollectionList();
  loadPhotos();
}

async function loadPhotoOptions() {
  const payload = await apiJson('/api/photos/options');
  photoOptions.cameras = payload.cameras || [];
  photoOptions.lenses = payload.lenses || [];
  photoOptions.formats = payload.formats || [];
  populateSelect(document.getElementById('filter-camera'), photoOptions.cameras.map(v => ({ value: v, label: v })), manageFilters.camera);
  populateSelect(document.getElementById('filter-lens'), photoOptions.lenses.map(v => ({ value: v, label: v })), manageFilters.lens);
  populateSelect(document.getElementById('filter-format'), photoOptions.formats.map(v => ({ value: v, label: v })), manageFilters.format);
}

async function loadBatches() {
  const payload = await apiJson('/api/batches');
  batches = payload.batches || [];
  const select = document.getElementById('batch-select');
  const empty = document.getElementById('batch-empty');
  if (!select) return;
  select.innerHTML = '';
  if (!batches.length) {
    if (empty) empty.hidden = false;
    select.disabled = true;
    return;
  }
  if (empty) empty.hidden = true;
  select.disabled = false;
  batches.forEach(batch => {
    const date = formatDateTimeDisplay(batch.uploaded_at);
    const option = document.createElement('option');
    option.value = batch.id;
    option.textContent = `${date} · ${batch.stored_photo_count}/${batch.total_files}`;
    select.appendChild(option);
  });
}

async function loadPhotos() {
  const tableBody = document.getElementById('manage-table-body');
  if (tableBody) tableBody.setAttribute('aria-busy', 'true');
  manageFilters.deleted = manageFilters.collectionId === 'recycle';
  const params = new URLSearchParams({
    collection_id: manageFilters.collectionId === 'recycle' ? 'all' : manageFilters.collectionId,
    q: manageFilters.q,
    camera: manageFilters.camera,
    lens: manageFilters.lens,
    format: manageFilters.format,
    date_from: manageFilters.dateFrom,
    date_to: manageFilters.dateTo,
    deleted: String(manageFilters.deleted),
    sort: manageFilters.sort,
    order: manageFilters.order,
    limit: manageFilters.limit,
    offset: manageFilters.offset,
  });
  try {
    const payload = await apiJson(`/api/photos?${params}`);
    managePhotos = payload.photos || [];
    manageTotal = payload.total || 0;
    selectedPhotoIds.forEach(id => {
      if (!managePhotos.some(photo => photo.id === id)) selectedPhotoIds.delete(id);
    });
    renderPhotoRows();
  } catch (error) {
    if (error.status !== 401) showToast(error.message || t('manage.error'), 'error');
  } finally {
    if (tableBody) tableBody.removeAttribute('aria-busy');
  }
}

function currentScopeTitle() {
  if (manageFilters.collectionId === 'all') return t('collection.all_photos');
  if (manageFilters.collectionId === 'none') return t('collection.ungrouped');
  if (manageFilters.collectionId === 'recycle') return t('collection.recycle_bin');
  const collection = getCollectionById(manageFilters.collectionId);
  return collection ? collection.name : t('collection.all_photos');
}

function renderPhotoRows() {
  const tbody = document.getElementById('manage-table-body');
  const count = document.getElementById('manage-photo-count');
  const empty = document.getElementById('manage-empty');
  const title = document.getElementById('manage-current-title');
  const selectAll = document.getElementById('select-all');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (title) title.textContent = currentScopeTitle();
  if (count) count.textContent = String(manageTotal);
  if (empty) empty.hidden = managePhotos.length > 0;

  managePhotos.forEach(photo => {
    const selected = selectedPhotoIds.has(photo.id);
    const row = document.createElement('tr');
    row.dataset.id = photo.id;
    row.classList.toggle('is-selected', selected);
    row.innerHTML = `
      <td class="column-check"><input type="checkbox" ${selected ? 'checked' : ''} aria-label="${escapeHtml(applyTemplate('manage.selected', { count: photo.id }))}"></td>
      <td><span class="cell-primary" title="${escapeHtml(photo.filename)}">${escapeHtml(truncate(photo.filename, 32))}</span></td>
      <td class="mono">${escapeHtml(formatDateTimeDisplay(photo.captured_at))}</td>
      <td>${escapeHtml(truncate(photo.camera_model || '-', 20))}</td>
      <td>${escapeHtml(truncate(photo.lens_model || '-', 22))}</td>
      <td class="mono">${photo.equiv_focal || '-'}</td>
      <td class="mono">${photo.aperture ? 'f/' + photo.aperture : '-'}</td>
      <td class="mono">${photo.iso || '-'}</td>
      <td class="mono">${escapeHtml(photo.format || '-')}</td>
      <td><div class="collection-chips">${(photo.collections || []).map(item => `<span class="collection-chip" style="--chip-color:${escapeHtml(item.color || '#38BDF8')}">${escapeHtml(item.name)}</span>`).join('')}</div></td>
      <td class="column-actions">
        <button class="icon-button" type="button" data-action="edit" title="${escapeHtml(t('manage.edit'))}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
        ${photo.deleted_at
          ? `<button class="icon-button" type="button" data-action="restore" title="${escapeHtml(t('manage.restore_photo'))}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>`
          : `<button class="icon-button icon-button--danger" type="button" data-action="delete" title="${escapeHtml(t('manage.delete_photo'))}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></svg></button>`}
      </td>
    `;
    const checkbox = row.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedPhotoIds.add(photo.id);
      else selectedPhotoIds.delete(photo.id);
      row.classList.toggle('is-selected', checkbox.checked);
      updateBulkBar();
    });
    checkbox.addEventListener('click', event => event.stopPropagation());
    row.addEventListener('click', event => {
      const action = event.target.closest('[data-action]');
      if (action) {
        event.stopPropagation();
        if (action.dataset.action === 'edit') openPhotoDrawer(photo.id);
        else if (action.dataset.action === 'restore') restorePhotos([photo.id]);
        else deletePhotos([photo.id]);
        return;
      }
      openPhotoDrawer(photo.id);
    });
    tbody.appendChild(row);
  });

  if (selectAll) selectAll.checked = managePhotos.length > 0 && managePhotos.every(photo => selectedPhotoIds.has(photo.id));
  updatePagination();
  updateBulkBar();
}

function updatePagination() {
  const pages = Math.max(1, Math.ceil(manageTotal / manageFilters.limit));
  const page = Math.floor(manageFilters.offset / manageFilters.limit) + 1;
  const label = document.getElementById('page-label');
  const prev = document.getElementById('btn-prev-page');
  const next = document.getElementById('btn-next-page');
  if (label) label.textContent = applyTemplate('manage.page', { page, pages });
  if (prev) prev.disabled = page <= 1;
  if (next) next.disabled = page >= pages;
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-bar');
  const count = document.getElementById('bulk-count');
  const deleted = manageFilters.collectionId === 'recycle';
  const addField = document.getElementById('bulk-add-collection').closest('.field');
  const removeField = document.getElementById('bulk-remove-collection').closest('.field');
  const apply = document.getElementById('btn-bulk-apply');
  const deleteButton = document.getElementById('btn-bulk-delete');
  const restoreButton = document.getElementById('btn-bulk-restore');
  const purge = document.getElementById('btn-purge');
  if (!bar) return;
  bar.hidden = selectedPhotoIds.size === 0;
  if (count) count.textContent = applyTemplate('manage.selected', { count: selectedPhotoIds.size });
  [addField, removeField, apply].forEach(el => { if (el) el.hidden = deleted; });
  if (deleteButton) deleteButton.hidden = deleted;
  if (restoreButton) restoreButton.hidden = !deleted;
  if (purge) purge.hidden = !deleted;
}

function resetFilters() {
  manageFilters.q = '';
  manageFilters.camera = '';
  manageFilters.lens = '';
  manageFilters.format = '';
  manageFilters.dateFrom = '';
  manageFilters.dateTo = '';
  manageFilters.sort = 'captured_at';
  manageFilters.order = 'desc';
  manageFilters.offset = 0;
  document.getElementById('manage-search').value = '';
  document.getElementById('filter-camera').value = '';
  document.getElementById('filter-lens').value = '';
  document.getElementById('filter-format').value = '';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  document.getElementById('filter-sort').value = manageFilters.sort;
  document.getElementById('filter-order').value = manageFilters.order;
  loadPhotos();
}

async function loadCollectionOptions() {
  await Promise.all([loadCollections(), loadBatches()]);
}

/* ============================================================
   11d. Collection CRUD
   ============================================================ */
function openCollectionDialog(collection = null) {
  const dialog = document.getElementById('collection-dialog');
  const title = document.getElementById('collection-dialog-title');
  const form = document.getElementById('collection-form');
  const id = document.getElementById('editing-collection-id');
  const name = document.getElementById('collection-name');
  const description = document.getElementById('collection-description');
  const color = document.getElementById('collection-color');
  title.textContent = t(collection ? 'collection.edit' : 'collection.new');
  id.value = collection ? collection.id : '';
  name.value = collection ? collection.name : '';
  description.value = collection ? (collection.description || '') : '';
  color.value = collection && collection.color ? collection.color : '#38BDF8';
  pendingBatchId = null;
  dialog.showModal();
  name.focus();
}

async function saveCollection(event) {
  event.preventDefault();
  const id = document.getElementById('editing-collection-id').value;
  const payload = {
    name: document.getElementById('collection-name').value.trim(),
    description: document.getElementById('collection-description').value.trim() || null,
    color: document.getElementById('collection-color').value,
  };
  if (!payload.name) return;
  try {
    if (id) {
      await apiJson(`/api/collections/${id}`, { method: 'PATCH', body: payload });
    } else if (pendingBatchId) {
      const batchId = pendingBatchId;
      pendingBatchId = null;
      await apiJson(`/api/batches/${batchId}/collection`, {
        method: 'POST',
        body: { name: payload.name, description: payload.description },
      });
      showToast(t('collection.batch.created'));
    } else {
      const collection = await apiJson('/api/collections', { method: 'POST', body: payload });
      const uploadSelect = document.getElementById('upload-collection');
      if (uploadSelect) uploadSelect.value = String(collection.id);
    }
    document.getElementById('collection-dialog').close();
    await loadCollectionOptions();
    await refreshSummary();
    await loadPhotos();
    showToast(t('manage.collection_saved'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function deleteCollection(collection) {
  const confirmed = await confirmDialog({
    message: `${t('manage.confirm_collection_delete')}\n${t('collection.deleted_notice')}`,
  });
  if (!confirmed) return;
  try {
    await apiJson(`/api/collections/${collection.id}`, { method: 'DELETE' });
    if (String(dashboardCollectionId) === String(collection.id)) {
      dashboardCollectionId = null;
      setDashboardScope('current');
    }
    await loadCollectionOptions();
    await refreshSummary();
    await loadPhotos();
    showToast(t('manage.collection_deleted'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function saveBatchCollection() {
  const batchId = document.getElementById('batch-select').value;
  if (!batchId) return;
  pendingBatchId = batchId;
  const batch = batches.find(item => String(item.id) === String(batchId));
  const suggested = `Batch ${formatDateTimeDisplay(batch && batch.uploaded_at).slice(0, 10)}`;
  openCollectionDialog(null);
  document.getElementById('collection-name').value = suggested;
}

/* ============================================================
   11e. Photo CRUD and Drawer
   ============================================================ */
async function openPhotoDrawer(photoId) {
  const drawer = document.getElementById('photo-drawer');
  try {
    const photo = await apiJson(`/api/photos/${photoId}`);
    currentPhoto = photo;
    const filename = document.getElementById('drawer-filename');
    const fields = {
      filename: 'edit-filename', format: 'edit-format', camera: 'edit-camera',
      lens: 'edit-lens', group: 'edit-group', focal: 'edit-focal',
      focal35: 'edit-focal-35', aperture: 'edit-aperture', iso: 'edit-iso',
      shutter: 'edit-shutter', equiv: 'edit-equiv',
    };
    document.getElementById(fields.filename).value = photo.filename || '';
    document.getElementById(fields.format).value = photo.format || '';
    document.getElementById('edit-file-size').value = formatFileSize(photo.file_size);
    document.getElementById('edit-hash').value = photo.content_hash || '';
    document.getElementById('edit-captured-at').value = formatDateTimeValue(photo.captured_at);
    document.getElementById(fields.camera).value = photo.camera_model || '';
    document.getElementById(fields.lens).value = photo.lens_model || '';
    document.getElementById(fields.group).value = photo.focal_group || '';
    document.getElementById(fields.focal).value = photo.focal_length ?? '';
    document.getElementById(fields.focal35).value = photo.focal_35mm ?? '';
    document.getElementById(fields.aperture).value = photo.aperture ?? '';
    document.getElementById(fields.iso).value = photo.iso ?? '';
    document.getElementById(fields.shutter).value = photo.exposure_time ?? '';
    document.getElementById(fields.equiv).value = photo.equiv_focal ?? '';
    if (filename) filename.textContent = photo.filename || '';
    renderDrawerCollections(photo);
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

function closePhotoDrawer() {
  const drawer = document.getElementById('photo-drawer');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  currentPhoto = null;
}

function renderDrawerCollections(photo) {
  const container = document.getElementById('drawer-collections');
  if (!container) return;
  container.innerHTML = '';
  const memberships = photo.collections || [];
  memberships.forEach(collection => {
    const chip = document.createElement('span');
    chip.className = 'collection-chip collection-chip--removable';
    chip.style.setProperty('--chip-color', collection.color || '#38BDF8');
    chip.innerHTML = `<i></i>${escapeHtml(collection.name)}<button type="button" aria-label="${escapeHtml(t('photo.remove_collection'))}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`;
    chip.querySelector('button').addEventListener('click', () => updatePhotoMembership(photo.id, collection.id, 'remove'));
    container.appendChild(chip);
  });

  const select = document.getElementById('drawer-add-collection');
  const available = collections.filter(item => !memberships.some(member => String(member.id) === String(item.id)));
  populateSelect(select, available.map(item => ({ value: item.id, label: item.name })), '', t('manage.all'));
  select.disabled = available.length === 0;
  document.getElementById('btn-add-drawer-collection').disabled = available.length === 0;
}

async function addDrawerCollection() {
  if (!currentPhoto) return;
  const collectionId = document.getElementById('drawer-add-collection').value;
  if (!collectionId) return;
  await updatePhotoMembership(currentPhoto.id, collectionId, 'add');
}

async function updatePhotoMembership(photoId, collectionId, action) {
  const endpoint = action === 'add'
    ? `/api/collections/${collectionId}/photos`
    : `/api/collections/${collectionId}/photos/remove`;
  try {
    await apiJson(endpoint, { method: 'POST', body: { photo_ids: [photoId] } });
    await Promise.all([loadCollections(), refreshSummary(), loadPhotos()]);
    await openPhotoDrawer(photoId);
    showToast(t(action === 'add' ? 'manage.bulk.updated' : 'photo.membership_removed'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function savePhoto(event) {
  event.preventDefault();
  if (!currentPhoto) return;
  const payload = {
    filename: document.getElementById('edit-filename').value,
    format: document.getElementById('edit-format').value,
    captured_at: document.getElementById('edit-captured-at').value || null,
    camera_model: document.getElementById('edit-camera').value,
    lens_model: document.getElementById('edit-lens').value,
    focal_length: document.getElementById('edit-focal').value || null,
    focal_35mm: document.getElementById('edit-focal-35').value || null,
    aperture: document.getElementById('edit-aperture').value || null,
    iso: document.getElementById('edit-iso').value || null,
    exposure_time: document.getElementById('edit-shutter').value || null,
  };
  try {
    await apiJson(`/api/photos/${currentPhoto.id}`, { method: 'PATCH', body: payload });
    await Promise.all([loadCollections(), refreshSummary(), loadPhotos(), loadPhotoOptions()]);
    await openPhotoDrawer(currentPhoto.id);
    showToast(t('manage.saved'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function deletePhotos(photoIds) {
  if (!photoIds.length) return showToast(t('manage.no_selection'), 'error');
  const confirmed = await confirmDialog({
    message: photoIds.length === 1 ? t('manage.confirm_delete_photo') : t('manage.confirm_bulk_delete'),
  });
  if (!confirmed) return;
  try {
    await apiJson('/api/photos/bulk-delete', { method: 'POST', body: { photo_ids: photoIds } });
    selectedPhotoIds.clear();
    await Promise.all([refreshSummary(), loadCollections(), loadPhotos()]);
    if (currentPhoto && photoIds.includes(currentPhoto.id)) closePhotoDrawer();
    showToast(t('manage.deleted'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function restorePhotos(photoIds) {
  if (!photoIds.length) return showToast(t('manage.no_selection'), 'error');
  try {
    await apiJson('/api/photos/bulk-restore', { method: 'POST', body: { photo_ids: photoIds } });
    selectedPhotoIds.clear();
    await Promise.all([refreshSummary(), loadCollections(), loadPhotos()]);
    showToast(t('manage.restored'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function purgePhotos() {
  const confirmed = await confirmDialog({
    message: t('manage.confirm_purge'),
    requireDelete: true,
  });
  if (!confirmed) return;
  try {
    await apiJson('/api/photos/purge', { method: 'POST', body: { confirm: 'DELETE' } });
    selectedPhotoIds.clear();
    await Promise.all([refreshSummary(), loadCollections(), loadPhotos()]);
    showToast(t('manage.purged'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

async function applyBulkCollections() {
  const addId = document.getElementById('bulk-add-collection').value;
  const removeId = document.getElementById('bulk-remove-collection').value;
  const photoIds = Array.from(selectedPhotoIds);
  if (!addId && !removeId) return;
  try {
    await apiJson('/api/photos/bulk-collections', {
      method: 'POST',
      body: {
        photo_ids: photoIds,
        add_collection_ids: addId ? [Number(addId)] : [],
        remove_collection_ids: removeId ? [Number(removeId)] : [],
      },
    });
    selectedPhotoIds.clear();
    await Promise.all([loadCollections(), refreshSummary(), loadPhotos()]);
    showToast(t('manage.bulk.updated'));
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

/* ============================================================
   11f. Dashboard Scope
   ============================================================ */
function clearDashboard() {
  document.querySelectorAll('.chart').forEach(el => {
    const chart = echarts.getInstanceByDom(el);
    if (chart) chart.dispose();
    el.innerHTML = '';
  });
  const tbody = document.getElementById('table-body');
  const count = document.getElementById('table-count');
  if (tbody) tbody.innerHTML = '';
  if (count) count.textContent = '0';
  const recommendations = document.getElementById('recommendations');
  if (recommendations) recommendations.style.display = 'none';
}

function setDashboardScope(scope) {
  dashboardScope = scope;
  document.querySelectorAll('#dashboard-scope-switch .scope-switch__button').forEach(button => {
    button.classList.toggle('is-active', button.dataset.scope === scope);
  });
}

async function loadDashboardScope(scope) {
  if (!authState.authenticated) {
    showToast(t('history.login_required'), 'error');
    showView('manage');
    return;
  }
  if (scope === 'collection' && !dashboardCollectionId) {
    showToast(t('history.no_data'), 'error');
    return;
  }
  const params = new URLSearchParams({ scope: scope === 'collection' ? 'collection' : scope });
  if (scope === 'collection') params.set('collection_id', dashboardCollectionId);
  try {
    const payload = await apiJson(`/api/history/stats?${params}`);
    setDashboardScope(scope);
    document.getElementById('nav-dashboard').style.display = '';
    if (!payload.total) {
      clearDashboard();
      _lastDashboardData = { total_processed: 0, photos: [], stats: {} };
      renderDashboard(_lastDashboardData);
      clearDashboard();
      showToast(t('history.no_data'));
      return;
    }
    _lastDashboardData = { total_processed: payload.total, stats: payload.stats };
    renderDashboard(_lastDashboardData);
  } catch (error) {
    showToast(error.message || t('manage.error'), 'error');
  }
}

function renderUploadTarget() {
  const block = document.getElementById('upload-target');
  const select = document.getElementById('upload-collection');
  const note = document.getElementById('upload-target-note');
  if (!block || !select || !note) return;
  block.hidden = !authState.authenticated;
  if (!authState.authenticated) return;
  const current = select.value;
  select.innerHTML = `<option value="">${escapeHtml(t('collection.ungrouped'))}</option>`;
  collections.forEach(collection => {
    const option = document.createElement('option');
    option.value = collection.id;
    option.textContent = collection.name;
    option.selected = String(collection.id) === current;
    select.appendChild(option);
  });
  if (!select.value) select.value = '';
  note.textContent = t('upload.target.authenticated');
}

function updateAuthToggle() {
  const toggle = document.getElementById('auth-toggle');
  if (!toggle) return;
  toggle.classList.toggle('is-authenticated', authState.authenticated);
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
  if (view === 'manage') {
    syncManagementView();
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

  /* ── Management, Dialog and Scope Events ── */
  document.getElementById('auth-form')?.addEventListener('submit', handleAuthSubmit);
  document.getElementById('btn-change-password')?.addEventListener('click', () => {
    document.getElementById('password-dialog').showModal();
  });
  document.getElementById('password-form')?.addEventListener('submit', changePassword);
  document.getElementById('btn-cancel-password')?.addEventListener('click', () => {
    document.getElementById('password-dialog').close();
  });
  document.getElementById('btn-new-collection')?.addEventListener('click', () => openCollectionDialog(null));
  document.getElementById('btn-upload-new-collection')?.addEventListener('click', () => openCollectionDialog(null));
  document.getElementById('btn-save-batch')?.addEventListener('click', saveBatchCollection);
  document.getElementById('collection-form')?.addEventListener('submit', saveCollection);
  document.getElementById('btn-cancel-collection')?.addEventListener('click', () => {
    document.getElementById('collection-dialog').close();
  });

  const searchInput = document.getElementById('manage-search');
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchInput.timer);
    searchInput.timer = setTimeout(() => {
      manageFilters.q = searchInput.value.trim();
      manageFilters.offset = 0;
      loadPhotos();
    }, 280);
  });
  [
    ['filter-camera', 'camera'], ['filter-lens', 'lens'], ['filter-format', 'format'],
    ['filter-sort', 'sort'], ['filter-order', 'order'],
  ].forEach(([id, key]) => {
    document.getElementById(id)?.addEventListener('change', event => {
      manageFilters[key] = event.target.value;
      manageFilters.offset = 0;
      loadPhotos();
    });
  });
  [
    ['filter-date-from', 'dateFrom'], ['filter-date-to', 'dateTo'],
  ].forEach(([id, key]) => {
    document.getElementById(id)?.addEventListener('change', event => {
      manageFilters[key] = event.target.value;
      manageFilters.offset = 0;
      loadPhotos();
    });
  });
  document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
  document.getElementById('select-all')?.addEventListener('change', event => {
    if (event.target.checked) managePhotos.forEach(photo => selectedPhotoIds.add(photo.id));
    else selectedPhotoIds.clear();
    renderPhotoRows();
  });
  document.getElementById('btn-prev-page')?.addEventListener('click', () => {
    manageFilters.offset = Math.max(0, manageFilters.offset - manageFilters.limit);
    loadPhotos();
  });
  document.getElementById('btn-next-page')?.addEventListener('click', () => {
    manageFilters.offset += manageFilters.limit;
    loadPhotos();
  });
  document.getElementById('btn-bulk-apply')?.addEventListener('click', applyBulkCollections);
  document.getElementById('btn-bulk-delete')?.addEventListener('click', () => deletePhotos(Array.from(selectedPhotoIds)));
  document.getElementById('btn-bulk-restore')?.addEventListener('click', () => restorePhotos(Array.from(selectedPhotoIds)));
  document.getElementById('btn-purge')?.addEventListener('click', purgePhotos);
  document.getElementById('photo-form')?.addEventListener('submit', savePhoto);
  document.getElementById('btn-close-drawer')?.addEventListener('click', closePhotoDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closePhotoDrawer);
  document.getElementById('btn-add-drawer-collection')?.addEventListener('click', addDrawerCollection);
  document.getElementById('btn-delete-photo')?.addEventListener('click', () => {
    if (currentPhoto) deletePhotos([currentPhoto.id]);
  });
  document.getElementById('btn-logout')?.addEventListener('click', logout);
  document.querySelectorAll('#dashboard-scope-switch .scope-switch__button').forEach(button => {
    button.addEventListener('click', () => loadDashboardScope(button.dataset.scope));
  });
  document.getElementById('dashboard-collection')?.addEventListener('change', event => {
    dashboardCollectionId = event.target.value || null;
  });

  syncManagementView();

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
    const targetCollectionId = document.getElementById('upload-collection').value;
    if (authState.authenticated && targetCollectionId) {
      formData.append('collection_id', targetCollectionId);
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
      if (data.persistence) {
        const persistence = data.persistence;
        const failed = Array.isArray(data.errors) ? data.errors.length : 0;
        showToast(applyTemplate('upload.persistence', {
          saved: persistence.saved_count,
          duplicates: persistence.duplicate_count,
          failed,
        }), failed > 0 ? 'error' : 'success');
        if (persistence.db_error) {
          showToast(t('upload.db_error'), 'error');
        }
        const collection = getCollectionById(persistence.collection_id);
        if (collection) {
          showToast(applyTemplate('upload.collection_saved', { name: collection.name }));
        }
        loadManagementData();
      }

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
    setDashboardScope('current');
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
