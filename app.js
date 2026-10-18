/* ========================================================
   KHO AN NINH - CORE APPLICATION LOGIC
   Mobile & PWA Ready - Offline & Google Sheets Synced
   Multi-User Role: Quản Lý Kho (Admin) vs Ban Giám Đốc (Viewer)
   ======================================================== */

// 1. DEFAULT MASTER DATA (PRELOADED 29 ITEMS)
const DEFAULT_INVENTORY = [
  { id: 'VT-CAM-01', name: 'Camera an ninh (Có SN)', category: 'Thiết bị chính', unit: 'Cái', qty: 6, min: 5, location: 'Kệ A1 - Tầng 2', note: 'Có Serial Number - Bắt buộc ghi nhận SN', hasSerial: true },
  { id: 'VT-BOX-01', name: 'Box Controller báo động (Có SN)', category: 'Thiết bị chính', unit: 'Cái', qty: 4, min: 3, location: 'Kệ A1 - Tầng 2', note: 'Có Serial Number - Bắt buộc ghi nhận SN', hasSerial: true },
  
  { id: 'VT-CB-CUA', name: 'Cảm biến cửa từ', category: 'Cảm biến', unit: 'Cái', qty: 24, min: 10, location: 'Kệ B1 - Khay 1', note: 'Dán băng xốp xanh hoặc bắt vít', hasSerial: false },
  { id: 'VT-CB-KHOI', name: 'Cảm biến khói', category: 'Cảm biến', unit: 'Cái', qty: 12, min: 5, location: 'Kệ B1 - Khay 2', note: 'Gắn trần nhà - Có sẵn đế gắn', hasSerial: false },
  { id: 'VT-CB-RUNGC', name: 'Cảm biến rung cơ', category: 'Cảm biến', unit: 'Cái', qty: 8, min: 5, location: 'Kệ B1 - Khay 3', note: 'Cảm biến rung cơ học truyền thống', hasSerial: false },
  { id: 'VT-CB-RUNGS', name: 'Cảm biến rung số (điện tử)', category: 'Cảm biến', unit: 'Cái', qty: 15, min: 5, location: 'Kệ B1 - Khay 4', note: 'Cảm biến vi xử lý độ nhạy cao', hasSerial: false },
  { id: 'VT-CB-NHIET', name: 'Cảm biến nhiệt độ', category: 'Cảm biến', unit: 'Cái', qty: 10, min: 5, location: 'Kệ B1 - Khay 5', note: 'Cảnh báo nhiệt quá ngưỡng', hasSerial: false },

  { id: 'VT-PK-NGUON', name: 'Nguồn adapter 12V DC', category: 'Phụ kiện', unit: 'Cái', qty: 16, min: 8, location: 'Kệ B2 - Ngăn 1', note: 'Nguồn rời cho Box hoặc cảm biến', hasSerial: false },
  { id: 'VT-PK-PIN', name: 'Hộp pin dự phòng (+ sạc 12V)', category: 'Phụ kiện', unit: 'Bộ', qty: 6, min: 3, location: 'Kệ B2 - Ngăn 2', note: 'Kèm pin sạc 12V DC từ NSX', hasSerial: false },
  { id: 'VT-PK-ANTEN', name: 'Ăng-ten thu phát sóng', category: 'Phụ kiện', unit: 'Cái', qty: 14, min: 5, location: 'Kệ B2 - Ngăn 3', note: 'Gắn Box Controller', hasSerial: false },
  { id: 'VT-PK-LOA', name: 'Loa / Còi hú báo động', category: 'Phụ kiện', unit: 'Cái', qty: 10, min: 5, location: 'Kệ B2 - Ngăn 4', note: 'Còi hú kết nối Box trung tâm', hasSerial: false },
  { id: 'VT-PK-CHIA-DC', name: 'Dây chia nguồn DC 2 đầu', category: 'Phụ kiện', unit: 'Sợi', qty: 25, min: 10, location: 'Kệ B2 - Ngăn 5', note: 'Dây đực - cái chia đôi nguồn DC', hasSerial: false },
  { id: 'VT-PK-POE', name: 'Nguồn PoE cho Camera', category: 'Phụ kiện', unit: 'Cái', qty: 8, min: 5, location: 'Kệ B2 - Ngăn 6', note: 'Cấp nguồn qua cáp Cat5', hasSerial: false },
  { id: 'VT-PK-PHICH', name: 'Phích cắm 220V AC (Đực - Cái)', category: 'Phụ kiện', unit: 'Bộ', qty: 20, min: 10, location: 'Khay C1 - Ngăn 1', note: 'Nối dài dây nguồn 220V', hasSerial: false },
  
  { id: 'VT-JK-02', name: 'Jack cắm 2 chân (2 pin)', category: 'Phụ kiện', unit: 'Cái', qty: 50, min: 20, location: 'Khay C2 - Ngăn 1', note: 'Kết nối cảm biến vào Box', hasSerial: false },
  { id: 'VT-JK-03', name: 'Jack cắm 3 chân (3 pin)', category: 'Phụ kiện', unit: 'Cái', qty: 40, min: 20, location: 'Khay C2 - Ngăn 2', note: 'Kết nối cảm biến vào Box', hasSerial: false },
  { id: 'VT-JK-04', name: 'Jack cắm 4 chân (4 pin)', category: 'Phụ kiện', unit: 'Cái', qty: 45, min: 20, location: 'Khay C2 - Ngăn 3', note: 'Kết nối Zone cảm biến vào Box', hasSerial: false },
  { id: 'VT-JK-08', name: 'Jack cắm 8 chân (8 pin)', category: 'Phụ kiện', unit: 'Cái', qty: 25, min: 10, location: 'Khay C2 - Ngăn 4', note: 'Cụm đa Zone trên Box', hasSerial: false },

  { id: 'VT-TH-RJ45', name: 'Hạt mạng RJ45', category: 'Tiêu hao', unit: 'Hạt', qty: 180, min: 100, location: 'Khay C3 - Ngăn 1', note: 'Bấm đầu dây Cat5 cho Camera', hasSerial: false },
  { id: 'VT-TH-KEO', name: 'Lọ keo A500 đục', category: 'Tiêu hao', unit: 'Lọ', qty: 8, min: 4, location: 'Kệ D1 - Thùng keo', note: 'Keo dán gắn cảm biến', hasSerial: false },
  { id: 'VT-TH-BDIEN', name: 'Băng dính điện đen', category: 'Tiêu hao', unit: 'Cuộn', qty: 15, min: 8, location: 'Khay C3 - Ngăn 2', note: 'Quấn cách điện mối nối', hasSerial: false },
  { id: 'VT-TH-BXOP', name: 'Băng dính 2 mặt xốp xanh lục', category: 'Tiêu hao', unit: 'Cuộn', qty: 12, min: 6, location: 'Khay C3 - Ngăn 3', note: 'Chuyên dán cảm biến cửa / rung', hasSerial: false },
  { id: 'VT-TH-THIT', name: 'Dây thít nhựa (lạt nhựa)', category: 'Tiêu hao', unit: 'Túi', qty: 10, min: 5, location: 'Khay C3 - Ngăn 4', note: 'Bó gọn dây cáp thi công', hasSerial: false },

  { id: 'VT-DAY-220V', name: 'Dây điện 2Cx0.5mm (220V AC)', category: 'Dây cáp', unit: 'Mét', qty: 280, min: 100, location: 'Giá treo dây 1', note: 'Kéo nguồn AC 220V', hasSerial: false },
  { id: 'VT-DAY-CUA', name: 'Dây đơn 0.5mm màu đen', category: 'Dây cáp', unit: 'Mét', qty: 350, min: 100, location: 'Giá treo dây 2', note: 'Chuyên kéo cảm biến cửa', hasSerial: false },
  { id: 'VT-DAY-RUNG', name: 'Dây đôi 2Cx0.5mm (Rung/Nhiệt)', category: 'Dây cáp', unit: 'Mét', qty: 260, min: 100, location: 'Giá treo dây 3', note: 'Nối cảm biến rung hoặc nhiệt', hasSerial: false },
  { id: 'VT-DAY-LOA', name: 'Dây đôi 2Cx0.5mm (Dây loa đỏ đen)', category: 'Dây cáp', unit: 'Mét', qty: 220, min: 100, location: 'Giá treo dây 4', note: 'Kéo tín hiệu ra còi hú loa', hasSerial: false },
  { id: 'VT-DAY-CAT5', name: 'Dây cáp mạng Cat5', category: 'Dây cáp', unit: 'Mét', qty: 520, min: 300, location: 'Thùng cáp mạng', note: 'Cáp mạng truyền tín hiệu & PoE camera', hasSerial: false },
  { id: 'VT-DAY-NGAM', name: 'Dây cáp ngầm 4 lõi 40.5kV', category: 'Dây cáp', unit: 'Mét', qty: 75, min: 30, location: 'Sàn kho khu vực nặng', note: 'Cáp ngầm trung thế chuyên dụng', hasSerial: false }
];

const DEFAULT_SERIALS = [
  { id: 'S1', sn: 'CAM-SN-2601', type: 'Camera an ninh (Có SN)', status: 'Trong kho', tech: '', project: '', updated: '2026-10-18' },
  { id: 'S2', sn: 'CAM-SN-2602', type: 'Camera an ninh (Có SN)', status: 'Trong kho', tech: '', project: '', updated: '2026-10-18' },
  { id: 'S3', sn: 'CAM-SN-2603', type: 'Camera an ninh (Có SN)', status: 'Đang thi công', tech: 'Nguyễn Văn A', project: 'Nhà kho Tân Bình', updated: '2026-10-18' },
  { id: 'S4', sn: 'BOX-SN-8801', type: 'Box Controller báo động (Có SN)', status: 'Trong kho', tech: '', project: '', updated: '2026-10-18' },
  { id: 'S5', sn: 'BOX-SN-8802', type: 'Box Controller báo động (Có SN)', status: 'Đã lắp đặt', tech: 'Trần Văn B', project: 'Trạm xăng số 5', updated: '2026-10-17' },
  { id: 'S6', sn: 'BOX-SN-8803', type: 'Box Controller báo động (Có SN)', status: 'Hỏng/Bảo hành', tech: 'Lê Văn C', project: 'Thu hồi từ Trạm C', updated: '2026-10-16' }
];

const DEFAULT_TOOLS = [
  { id: 'DC-01', name: 'Súng bắn keo #1', status: 'loaned', borrower: 'Nguyễn Văn A', project: 'Nhà kho Tân Bình', date: '2026-10-18' },
  { id: 'DC-02', name: 'Tua vít 2 cạnh 2mm (vặn jack)', status: 'available', borrower: '', project: '', date: '' },
  { id: 'DC-03', name: 'Tua vít 4 cạnh cỡ 6', status: 'available', borrower: '', project: '', date: '' },
  { id: 'DC-04', name: 'Kìm bấm mạng RJ45', status: 'loaned', borrower: 'Nguyễn Văn A', project: 'Nhà kho Tân Bình', date: '2026-10-18' },
  { id: 'DC-05', name: 'Kìm cắt dây điện/dây thít', status: 'available', borrower: '', project: '', date: '' },
  { id: 'DC-06', name: 'Dao rọc giấy', status: 'available', borrower: '', project: '', date: '' }
];

const DEFAULT_KITS = [
  {
    id: 'KIT-FULL-BOX',
    name: 'Kit Trạm Box Đầy Đủ',
    icon: '⚡',
    desc: '1 Box, Pin sạc/Nguồn 12V, Ăng-ten, Loa, Phích 220V, Jack 4/8 pin',
    isCustom: false,
    items: [
      { id: 'VT-BOX-01', qty: 1 },
      { id: 'VT-PK-PIN', qty: 1 },
      { id: 'VT-PK-ANTEN', qty: 1 },
      { id: 'VT-PK-LOA', qty: 1 },
      { id: 'VT-PK-PHICH', qty: 1 },
      { id: 'VT-JK-04', qty: 1 },
      { id: 'VT-JK-08', qty: 1 }
    ]
  },
  {
    id: 'KIT-ONLY-BOX',
    name: 'Chỉ Bán Box Lẻ (Không Cảm Biến)',
    icon: '📦',
    desc: '1 Box Controller, Nguồn 12V, Ăng-ten, Phích 220V, Jack cắm (Khách thiếu/đổi box)',
    isCustom: false,
    items: [
      { id: 'VT-BOX-01', qty: 1 },
      { id: 'VT-PK-NGUON', qty: 1 },
      { id: 'VT-PK-ANTEN', qty: 1 },
      { id: 'VT-PK-PHICH', qty: 1 },
      { id: 'VT-JK-04', qty: 1 }
    ]
  },
  {
    id: 'KIT-ONLY-SENSORS',
    name: 'Bán Cảm Biến Lẻ (Không Lấy Box)',
    icon: '🚪',
    desc: '2 Cửa từ, 1 Khói, 1 Rung số, Băng xốp xanh, 30m Dây đen, 2 Jack nối',
    isCustom: false,
    items: [
      { id: 'VT-CB-CUA', qty: 2 },
      { id: 'VT-CB-KHOI', qty: 1 },
      { id: 'VT-CB-RUNGS', qty: 1 },
      { id: 'VT-TH-BXOP', qty: 1 },
      { id: 'VT-DAY-CUA', qty: 30 },
      { id: 'VT-JK-02', qty: 2 }
    ]
  },
  {
    id: 'KIT-CAMERA',
    name: 'Kit Camera Giám Sát',
    icon: '📹',
    desc: '1 Camera, 1 Nguồn PoE, 4 Hạt mạng RJ45, 25m Dây Cat5',
    isCustom: false,
    items: [
      { id: 'VT-CAM-01', qty: 1 },
      { id: 'VT-PK-POE', qty: 1 },
      { id: 'VT-TH-RJ45', qty: 4 },
      { id: 'VT-DAY-CAT5', qty: 25 }
    ]
  },
  {
    id: 'KIT-SPEAKER-EXT',
    name: 'Kit Bổ Sung Còi Báo Động & Dây',
    icon: '🔔',
    desc: '1 Loa còi hú báo động, 1 Dây chia DC, 20m Dây loa đỏ đen',
    isCustom: false,
    items: [
      { id: 'VT-PK-LOA', qty: 1 },
      { id: 'VT-PK-CHIA-DC', qty: 1 },
      { id: 'VT-DAY-LOA', qty: 20 }
    ]
  }
];

const DEFAULT_USERS = [
  { id: 'u1', username: 'thukho', password: '123', name: 'Quản Lý Kho (Bạn)', role: 'admin' },
  { id: 'u2', username: 'sep', password: '123', name: 'Ban Giám Đốc (Sếp)', role: 'viewer' }
];

const DEFAULT_DISPATCH_HISTORY = [
  {
    id: 'PXK-261017-01',
    date: '2026-10-17 14:20',
    month: '2026-10',
    project: 'Trạm xăng số 5',
    tech: 'Trần Văn B',
    items: [
      { name: 'Box Controller báo động (Có SN)', qty: 1, unit: 'Cái', sn: 'BOX-SN-8802' },
      { name: 'Dây cáp mạng Cat5', qty: 50, unit: 'Mét' },
      { name: 'Cảm biến cửa từ', qty: 4, unit: 'Cái' },
      { name: 'Loa / Còi hú báo động', qty: 1, unit: 'Cái' }
    ],
    status: 'Đã hoàn thành'
  },
  {
    id: 'PXK-261018-01',
    date: '2026-10-18 08:30',
    month: '2026-10',
    project: 'Nhà kho Tân Bình',
    tech: 'Nguyễn Văn A',
    items: [
      { name: 'Camera an ninh (Có SN)', qty: 1, unit: 'Cái', sn: 'CAM-SN-2603' },
      { name: 'Nguồn PoE cho Camera', qty: 1, unit: 'Cái' },
      { name: 'Dây cáp mạng Cat5', qty: 25, unit: 'Mét' },
      { name: 'Hạt mạng RJ45', qty: 4, unit: 'Hạt' }
    ],
    status: 'Đang thi công'
  }
];

// 2. STATE INITIALIZATION & LOCALSTORAGE MANAGEMENT
class WarehouseStore {
  constructor() {
    this.inventory = this.load('wh_inventory', DEFAULT_INVENTORY);
    this.serials = this.load('wh_serials', DEFAULT_SERIALS);
    this.tools = this.load('wh_tools', DEFAULT_TOOLS);
    this.customKits = this.load('wh_custom_kits', DEFAULT_KITS);
    this.dispatchHistory = this.load('wh_dispatch_history', DEFAULT_DISPATCH_HISTORY);
    this.returnHistory = this.load('wh_returns', [
      { id: 'R1', date: '2026-10-17 17:30', project: 'Trạm xăng số 5', item: 'Dây cáp mạng Cat5', qty: 25, unit: 'Mét', condition: 'good', note: 'Thừa trả lại kho' },
      { id: 'R2', date: '2026-10-16 16:15', project: 'Thu hồi từ Trạm C', item: 'Box Controller báo động', qty: 1, unit: 'Cái', condition: 'defective', note: 'Mất nguồn, đã chuyển kho bảo hành' }
    ]);
    this.currentUser = this.load('wh_current_user', DEFAULT_USERS[0]);
    
    // Tự động nhận link Google Sheet nếu được chia sẻ qua URL: ?sheet=...
    const urlParams = new URLSearchParams(window.location.search);
    const querySheet = urlParams.get('sheet');
    if (querySheet) {
      this.sheetApiUrl = querySheet;
      localStorage.setItem('wh_sheet_api_url', querySheet);
    } else {
      this.sheetApiUrl = localStorage.getItem('wh_sheet_api_url') || '';
    }

    this.currentMonth = this.load('wh_current_month', '2026-10');
    this.availableMonths = this.load('wh_available_months', ['2026-10', '2026-09', '2026-08']);
    this.pickingCart = [];
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage load error:', e);
      return fallback;
    }
  }

  save() {
    localStorage.setItem('wh_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('wh_serials', JSON.stringify(this.serials));
    localStorage.setItem('wh_tools', JSON.stringify(this.tools));
    localStorage.setItem('wh_customKits', JSON.stringify(this.customKits));
    localStorage.setItem('wh_dispatch_history', JSON.stringify(this.dispatchHistory));
    localStorage.setItem('wh_returns', JSON.stringify(this.returnHistory));
    localStorage.setItem('wh_current_user', JSON.stringify(this.currentUser));
    localStorage.setItem('wh_current_month', JSON.stringify(this.currentMonth));
    localStorage.setItem('wh_available_months', JSON.stringify(this.availableMonths));
  }
}

const store = new WarehouseStore();

// 3. UI CONTROLLER & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  initTabs();
  initFilters();
  initSearch();
  initPickingSystem();
  initInwardAndReturn();
  initToolsModule();
  initAuthAndRoles();
  initGoogleSheetsSync();
  initModals();
  initBackupSystem();
  
  applyUserRole();
  renderAll();

  // Tự động load dữ liệu từ Google Sheets khi mở app hoặc F5 (nếu đã cài đặt link Sheet)
  if (store.sheetApiUrl) {
    fetchFromGoogleSheet(false);
  }
});

// PWA Service Worker
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW registration error:', err));
  }
}

// Tab Switching
function initTabs() {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  const panes = document.querySelectorAll('.tab-pane');

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      navItems.forEach((b) => b.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Master Render Function
function renderAll() {
  renderStats();
  renderInventory();
  renderSerials();
  renderKits();
  renderPickingCart();
  populateDropdowns();
  renderTools();
  renderReturnHistory();
  renderDispatchHistory();
  renderSyncStatus();
}

// 4. STATS BAR RENDERING
function renderStats() {
  const total = store.inventory.length;
  const lowStock = store.inventory.filter((item) => item.qty <= item.min).length;
  const camInStock = store.serials.filter((s) => s.type.includes('Camera') && s.status === 'Trong kho').length;
  const boxInStock = store.serials.filter((s) => s.type.includes('Box') && s.status === 'Trong kho').length;
  const toolsLoaned = store.tools.filter((t) => t.status === 'loaned').length;

  document.getElementById('stat-total-items').textContent = total;
  document.getElementById('stat-low-stock').textContent = lowStock;
  document.getElementById('stat-cam-stock').textContent = camInStock;
  document.getElementById('stat-box-stock').textContent = boxInStock;
  document.getElementById('stat-tools-loaned').textContent = toolsLoaned;

  const lowBadge = document.getElementById('badge-low-stock-nav');
  if (lowStock > 0) {
    lowBadge.textContent = lowStock;
    lowBadge.classList.remove('hidden');
  } else {
    lowBadge.classList.add('hidden');
  }
}

// 5. INVENTORY MODULE
let currentCatFilter = 'all';
let currentSearchQuery = '';

function initFilters() {
  const filterBtns = document.querySelectorAll('#category-filters .filter-pill');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCatFilter = btn.getAttribute('data-cat');
      renderInventory();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('inventory-search');
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    renderInventory();
  });
}

function renderInventory() {
  const container = document.getElementById('inventory-grid');
  container.innerHTML = '';

  const filtered = store.inventory.filter((item) => {
    const matchCat = currentCatFilter === 'all' || item.category.includes(currentCatFilter);
    const matchSearch =
      item.name.toLowerCase().includes(currentSearchQuery) ||
      item.id.toLowerCase().includes(currentSearchQuery) ||
      item.location.toLowerCase().includes(currentSearchQuery) ||
      (item.note && item.note.toLowerCase().includes(currentSearchQuery));
    return matchCat && matchSearch;
  });

  document.getElementById('count-all').textContent = store.inventory.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="picking-cart-empty">Không tìm thấy vật tư phù hợp.</div>`;
    return;
  }

  filtered.forEach((item) => {
    const isLow = item.qty <= item.min && item.qty > 0;
    const isOut = item.qty === 0;
    let badgeClass = 'cat-phu-kien';
    if (item.category.includes('Thiết bị')) badgeClass = 'cat-thiet-bi';
    else if (item.category.includes('Cảm biến')) badgeClass = 'cat-cam-bien';
    else if (item.category.includes('Dây')) badgeClass = 'cat-day-cap';
    else if (item.category.includes('Tiêu hao')) badgeClass = 'cat-tieu-hao';

    const card = document.createElement('div');
    card.className = `inventory-card ${isOut ? 'out-of-stock' : isLow ? 'low-stock' : ''}`;
    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="item-badge ${badgeClass}">${item.category}</span>
          ${isOut ? '<span class="status-badge status-defective">Hết hàng</span>' : isLow ? '<span class="status-badge status-deploying">Sắp hết</span>' : ''}
        </div>
        <h3 class="item-name">${item.name}</h3>
        <p class="item-location">📍 ${item.location || 'Chưa xếp'}</p>
        ${item.note ? `<p class="text-sm text-muted mt-1" style="font-size:0.75rem">${item.note}</p>` : ''}
      </div>
      <div class="card-bottom">
        <div class="qty-block">
          <span class="qty-num">${item.qty}</span>
          <span class="qty-unit">${item.unit} (Tối thiểu: ${item.min})</span>
        </div>
        <div class="card-actions">
          <button class="btn-card-action" onclick="quickAddToPick('${item.id}')">+ Lấy đồ</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 6. SERIAL TRACKING MODULE
let currentSerialFilter = 'all';
let currentSerialQuery = '';

function renderSerials() {
  const container = document.getElementById('serial-list');
  container.innerHTML = '';

  const filterBtns = document.querySelectorAll('#serial-status-filters .filter-pill');
  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentSerialFilter = btn.getAttribute('data-status');
      renderSerials();
    };
  });

  const searchInput = document.getElementById('serial-search');
  searchInput.oninput = (e) => {
    currentSerialQuery = e.target.value.toLowerCase().trim();
    renderSerials();
  };

  const filtered = store.serials.filter((s) => {
    const matchStatus = currentSerialFilter === 'all' || s.status === currentSerialFilter;
    const matchSearch =
      s.sn.toLowerCase().includes(currentSerialQuery) ||
      s.type.toLowerCase().includes(currentSerialQuery) ||
      (s.tech && s.tech.toLowerCase().includes(currentSerialQuery)) ||
      (s.project && s.project.toLowerCase().includes(currentSerialQuery));
    return matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="picking-cart-empty">Không có thiết bị Serial nào khớp.</div>`;
    return;
  }

  filtered.forEach((s) => {
    let statusClass = 'status-in-stock';
    if (s.status === 'Đang thi công') statusClass = 'status-deploying';
    else if (s.status === 'Đã lắp đặt') statusClass = 'status-deployed';
    else if (s.status === 'Hỏng/Bảo hành') statusClass = 'status-defective';

    const card = document.createElement('div');
    card.className = 'serial-card';
    card.innerHTML = `
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <span class="serial-code">SN: ${s.sn}</span>
          <span class="status-badge ${statusClass}">${s.status}</span>
        </div>
        <strong style="font-size:0.9rem">${s.type}</strong>
        ${s.project ? `<p class="text-sm text-muted mt-1">Công trình: <strong>${s.project}</strong> ${s.tech ? `(KTV: ${s.tech})` : ''}</p>` : '<p class="text-sm text-muted mt-1">Sẵn sàng xuất kho</p>'}
      </div>
      <div class="card-actions admin-only">
        ${s.status === 'Trong kho' ? `<button class="btn-sm btn-primary" onclick="quickDeploySerial('${s.id}')">Gán công trình</button>` : ''}
        ${s.status !== 'Hỏng/Bảo hành' ? `<button class="btn-sm text-danger" onclick="markSerialDefective('${s.id}')">Báo hỏng</button>` : `<button class="btn-sm text-success" onclick="markSerialFixed('${s.id}')">Đã sửa xong</button>`}
      </div>
    `;
    container.appendChild(card);
  });
}

function quickDeploySerial(serialId) {
  if (store.currentUser.role !== 'admin') return;
  const item = store.serials.find((s) => s.id === serialId);
  if (!item) return;
  const project = prompt('Nhập tên công trình lắp đặt:', 'Công trình mới');
  if (!project) return;
  const tech = prompt('Nhập tên kỹ thuật viên nhận:', 'KTV');

  item.status = 'Đang thi công';
  item.project = project;
  item.tech = tech || 'KTV';
  item.updated = new Date().toISOString().slice(0, 10);
  store.save();
  renderAll();
  showToast(`Đã xuất thiết bị ${item.sn} cho ${item.project}`, 'success');
}

function markSerialDefective(serialId) {
  if (store.currentUser.role !== 'admin') return;
  const item = store.serials.find((s) => s.id === serialId);
  if (!item) return;
  if (confirm(`Bạn có chắc muốn chuyển thiết bị ${item.sn} vào Kho Hàng Hỏng / Bảo Hành?`)) {
    item.status = 'Hỏng/Bảo hành';
    item.updated = new Date().toISOString().slice(0, 10);
    store.save();
    renderAll();
    showToast(`Đã chuyển ${item.sn} sang kho bảo hành (RMA)`, 'error');
  }
}

function markSerialFixed(serialId) {
  if (store.currentUser.role !== 'admin') return;
  const item = store.serials.find((s) => s.id === serialId);
  if (!item) return;
  item.status = 'Trong kho';
  item.project = '';
  item.tech = '';
  item.updated = new Date().toISOString().slice(0, 10);
  store.save();
  renderAll();
  showToast(`Đã nhập lại ${item.sn} vào kho sau bảo hành`, 'success');
}

// 7. PICKING LIST & DYNAMIC KITS MANAGEMENT
function renderKits() {
  const container = document.getElementById('kit-buttons-container');
  if (!container) return;
  container.innerHTML = '';

  store.customKits.forEach((kit) => {
    const card = document.createElement('div');
    card.className = 'btn-kit';
    card.innerHTML = `
      <span class="btn-kit-icon">${kit.icon || '📦'}</span>
      <div class="btn-kit-content">
        <strong>
          ${kit.name}
          ${kit.isCustom ? '<span class="badge-kit-project">Dự án</span>' : ''}
        </strong>
        <small>${kit.desc || 'Bộ kit gồm nhiều linh kiện'}</small>
      </div>
      ${kit.isCustom ? `<button class="btn-kit-del" title="Xóa bộ kit này" onclick="deleteCustomKit(event, '${kit.id}')">&times;</button>` : ''}
    `;

    card.onclick = (e) => {
      if (e.target.closest('.btn-kit-del')) return;
      applyKitToCart(kit);
    };

    container.appendChild(card);
  });
}

function applyKitToCart(kit) {
  if (!kit.items || kit.items.length === 0) return;
  kit.items.forEach((it) => {
    addOrIncrementPick(it.id, it.qty);
  });
  showToast(`Đã thêm: "${kit.name}" vào phiếu soạn hàng!`, 'success');
}

window.deleteCustomKit = function (e, kitId) {
  e.stopPropagation();
  if (store.currentUser.role !== 'admin') return;
  const kit = store.customKits.find((k) => k.id === kitId);
  if (!kit) return;
  if (confirm(`Bạn có chắc muốn xóa bộ Kit "${kit.name}"?`)) {
    store.customKits = store.customKits.filter((k) => k.id !== kitId);
    store.save();
    renderKits();
    showToast(`Đã xóa bộ Kit "${kit.name}"`, 'info');
  }
};

function initPickingSystem() {
  initKitManagement();

  // Manual Add Item to Picking Cart
  document.getElementById('btn-pick-add-item').onclick = () => {
    const select = document.getElementById('pick-add-select');
    const qtyInput = document.getElementById('pick-add-qty');
    const itemId = select.value;
    const qty = parseInt(qtyInput.value) || 1;
    if (itemId) {
      addOrIncrementPick(itemId, qty);
      showToast('Đã thêm vật tư vào phiếu soạn đồ!', 'success');
    }
  };

  // Clear Picking Cart
  document.getElementById('btn-clear-picking').onclick = () => {
    if (store.pickingCart.length === 0) return;
    if (confirm('Xóa danh sách soạn hàng hiện tại?')) {
      store.pickingCart = [];
      renderPickingCart();
    }
  };

  // Generate Printable Picking Slip Modal
  document.getElementById('btn-generate-slip').onclick = openPickingSlipModal;

  // Confirm Dispatch (Xác nhận xuất kho chính thức)
  const btnConfirmDispatch = document.getElementById('btn-confirm-dispatch');
  if (btnConfirmDispatch) {
    btnConfirmDispatch.onclick = handleConfirmDispatch;
  }
}

function handleConfirmDispatch() {
  if (store.currentUser.role !== 'admin') {
    showToast('Chỉ Quản lý kho mới có quyền xác nhận xuất hàng!', 'error');
    return;
  }
  if (store.pickingCart.length === 0) {
    showToast('Phiếu soạn hàng đang trống!', 'error');
    return;
  }

  const projectName = document.getElementById('pick-project-name').value.trim() || 'Công trình mới';
  const techName = document.getElementById('pick-tech-name').value.trim() || 'Kỹ thuật viên';

  // Deduct inventory
  store.pickingCart.forEach((p) => {
    const invItem = store.inventory.find((i) => i.id === p.itemId);
    if (invItem) {
      invItem.qty = Math.max(0, invItem.qty - p.qty);
    }
  });

  // Create dispatch history record
  const newDispatch = {
    id: 'PXK-' + Date.now().toString().slice(-6),
    date: new Date().toLocaleString('vi-VN'),
    month: store.currentMonth,
    project: projectName,
    tech: techName,
    items: store.pickingCart.map((p) => ({ name: p.name, qty: p.qty, unit: p.unit })),
    status: 'Đã xuất kho'
  };

  store.dispatchHistory.unshift(newDispatch);
  store.pickingCart = [];
  store.save();
  renderAll();

  // Close modal
  document.getElementById('modal-picking-slip').classList.remove('open');
  showToast(`Đã xuất kho thành công cho công trình "${projectName}"!`, 'success');

  // Push to Google Sheets if connected
  if (store.sheetApiUrl) {
    pushToGoogleSheet(false);
  }
}

function initKitManagement() {
  // Save current cart as custom project kit (1 Click)
  const btnSaveCart = document.getElementById('btn-save-cart-as-kit');
  if (btnSaveCart) {
    btnSaveCart.onclick = () => {
      if (store.pickingCart.length === 0) {
        showToast('Giỏ soạn hàng đang trống! Vui lòng chọn các món cần tạo Kit trước.', 'error');
        return;
      }
      const kitName = prompt('Nhập tên Bộ Kit / Tên Dự Án cho danh sách này (VD: Kit Dự Án Ngân Hàng ACB - 6 Cửa):');
      if (!kitName || !kitName.trim()) return;

      const desc = store.pickingCart.map((p) => `${p.qty} ${p.unit} ${p.name}`).slice(0, 3).join(', ') + (store.pickingCart.length > 3 ? '...' : '');

      const newKit = {
        id: 'KIT-PRJ-' + Date.now(),
        name: kitName.trim(),
        icon: '🏭',
        desc: desc,
        isCustom: true,
        items: store.pickingCart.map((p) => ({ id: p.itemId, qty: p.qty }))
      };

      store.customKits.push(newKit);
      store.save();
      renderKits();
      showToast(`Đã lưu Bộ Kit: "${kitName}"! Lần sau bạn có thể bấm 1 chạm để lấy đồ.`, 'success');
    };
  }

  // Open modal create kit
  const btnOpenCreate = document.getElementById('btn-open-create-kit');
  if (btnOpenCreate) {
    btnOpenCreate.onclick = () => {
      const container = document.getElementById('kit-items-builder-container');
      container.innerHTML = '';
      addKitBuilderRow();
      addKitBuilderRow();
      document.getElementById('modal-create-kit').classList.add('open');
    };
  }

  // Add Row in kit builder
  const btnAddRow = document.getElementById('btn-add-kit-item-row');
  if (btnAddRow) {
    btnAddRow.onclick = () => addKitBuilderRow();
  }

  // Submit create kit form
  const formCreateKit = document.getElementById('form-create-kit');
  if (formCreateKit) {
    formCreateKit.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('kit-name-input').value.trim();
      const icon = document.getElementById('kit-icon-select').value;
      const desc = document.getElementById('kit-desc-input').value.trim();

      const rows = document.querySelectorAll('#kit-items-builder-container .kit-builder-row');
      const items = [];
      rows.forEach((r) => {
        const select = r.querySelector('select');
        const input = r.querySelector('input');
        const qty = parseInt(input.value) || 1;
        if (select && select.value) {
          items.push({ id: select.value, qty });
        }
      });

      if (items.length === 0) {
        showToast('Vui lòng thêm ít nhất 1 vật tư vào Bộ Kit!', 'error');
        return;
      }

      const newKit = {
        id: 'KIT-PRJ-' + Date.now(),
        name,
        icon,
        desc: desc || `Gồm ${items.length} món vật tư`,
        isCustom: true,
        items
      };

      store.customKits.push(newKit);
      store.save();
      renderKits();
      document.getElementById('modal-create-kit').classList.remove('open');
      formCreateKit.reset();
      showToast(`Đã tạo thành công Bộ Kit: "${name}"!`, 'success');
    };
  }
}

function addKitBuilderRow() {
  const container = document.getElementById('kit-items-builder-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'kit-builder-row';

  const options = store.inventory
    .map((item) => `<option value="${item.id}">[${item.category}] ${item.name} (${item.unit})</option>`)
    .join('');

  row.innerHTML = `
    <select class="input-field">
      ${options}
    </select>
    <input type="number" class="input-field" min="1" value="1" placeholder="SL">
    <button type="button" class="btn-sm text-danger" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(row);
}

function quickAddToPick(itemId) {
  addOrIncrementPick(itemId, 1);
  showToast('Đã thêm vào danh sách soạn hàng!', 'success');
}

function addOrIncrementPick(itemId, qty = 1) {
  const existing = store.pickingCart.find((p) => p.itemId === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    const item = store.inventory.find((i) => i.id === itemId);
    if (item) {
      store.pickingCart.push({ itemId, name: item.name, unit: item.unit, qty, hasSerial: item.hasSerial });
    }
  }
  renderPickingCart();
}

function renderPickingCart() {
  const container = document.getElementById('picking-cart-container');
  const countSpan = document.getElementById('pick-item-count');
  const navBadge = document.getElementById('badge-picking-nav');

  countSpan.textContent = store.pickingCart.length;
  if (store.pickingCart.length > 0) {
    navBadge.textContent = store.pickingCart.length;
    navBadge.classList.remove('hidden');
  } else {
    navBadge.classList.add('hidden');
  }

  if (store.pickingCart.length === 0) {
    container.className = 'picking-cart-empty';
    container.innerHTML = 'Chưa chọn vật tư nào. Hãy bấm các nút Kit ở trên hoặc chọn thêm vật tư bên dưới!';
    return;
  }

  container.className = '';
  container.innerHTML = '';
  store.pickingCart.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'pick-cart-item';
    row.innerHTML = `
      <div>
        <strong style="font-size:0.88rem">${p.name}</strong>
        ${p.hasSerial ? '<small class="text-danger d-block">★ Bắt buộc ghi SN khi xuất</small>' : ''}
      </div>
      <div class="pick-qty-control">
        <button class="btn-qty" onclick="changePickQty(${idx}, -1)">-</button>
        <span style="font-weight:700; min-width:35px; text-align:center">${p.qty} ${p.unit}</span>
        <button class="btn-qty" onclick="changePickQty(${idx}, 1)">+</button>
        <button class="btn-sm text-danger" onclick="removePickItem(${idx})" style="margin-left:6px">✕</button>
      </div>
    `;
    container.appendChild(row);
  });
}

window.changePickQty = function (idx, delta) {
  store.pickingCart[idx].qty += delta;
  if (store.pickingCart[idx].qty <= 0) {
    store.pickingCart.splice(idx, 1);
  }
  renderPickingCart();
};

window.removePickItem = function (idx) {
  store.pickingCart.splice(idx, 1);
  renderPickingCart();
};

function openPickingSlipModal() {
  if (store.pickingCart.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 vật tư để xuất phiếu!', 'error');
    return;
  }

  const projectName = document.getElementById('pick-project-name').value.trim() || 'Công trình chưa đặt tên';
  const techName = document.getElementById('pick-tech-name').value.trim() || 'Chưa chỉ định KTV';
  const today = new Date().toLocaleDateString('vi-VN');

  let rowsHtml = '';
  store.pickingCart.forEach((p, i) => {
    rowsHtml += `
      <tr>
        <td style="text-align:center">${i + 1}</td>
        <td><strong>${p.name}</strong> ${p.hasSerial ? '<br><small style="color:#DC2626">Ghi SN: .......................................</small>' : ''}</td>
        <td style="text-align:center">${p.qty} ${p.unit}</td>
        <td style="text-align:center">....... ${p.unit}</td>
        <td style="text-align:center">....... ${p.unit}</td>
      </tr>
    `;
  });

  const slipContent = `
    <div class="slip-container" id="printable-area">
      <div class="slip-header">
        <h2>PHIẾU SOẠN HÀNG THI CÔNG KHO VẬT TƯ</h2>
        <p style="font-size:0.85rem; color:#64748B">Hệ thống Camera Giám Sát & Controller Báo Động</p>
      </div>
      <div class="slip-meta-grid">
        <div><strong>Công trình / Khách hàng:</strong> ${projectName}</div>
        <div><strong>Ngày xuất kho:</strong> ${today}</div>
        <div><strong>Kỹ thuật viên phụ trách:</strong> ${techName}</div>
        <div><strong>Thủ kho soạn hàng:</strong> Quản lý kho</div>
      </div>
      <table class="slip-table">
        <thead>
          <tr>
            <th style="width:35px; text-align:center">STT</th>
            <th>Tên vật tư / Thiết bị</th>
            <th style="width:90px; text-align:center">Yêu cầu</th>
            <th style="width:90px; text-align:center">Thực xuất</th>
            <th style="width:90px; text-align:center">Thu hồi dư</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div class="slip-signatures">
        <div>
          KỸ THUẬT VIÊN NHẬN ĐỒ<br><small>(Ký & ghi rõ họ tên)</small>
        </div>
        <div>
          THỦ KHO XUẤT HÀNG<br><small>(Ký & ghi rõ họ tên)</small>
        </div>
      </div>
    </div>
  `;

  document.getElementById('picking-slip-print-content').innerHTML = slipContent;
  document.getElementById('modal-picking-slip').classList.add('open');
}

// 8. DISPATCH HISTORY LOG (NHẬT KÝ LẤY ĐỒ - CHO SẾP & THỦ KHO)
function renderDispatchHistory() {
  const container = document.getElementById('dispatch-history-list');
  const totalCountEl = document.getElementById('history-total-count');
  if (!container) return;

  const searchInput = document.getElementById('history-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Filter by current month and search query
  const filtered = store.dispatchHistory.filter((d) => {
    const matchMonth = !d.month || d.month === store.currentMonth;
    const matchQuery =
      !query ||
      d.project.toLowerCase().includes(query) ||
      d.tech.toLowerCase().includes(query) ||
      d.id.toLowerCase().includes(query) ||
      (d.items && d.items.some((it) => it.name.toLowerCase().includes(query)));
    return matchMonth && matchQuery;
  });

  if (totalCountEl) totalCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="picking-cart-empty">Chưa có lượt xuất đồ nào trong kỳ ${store.currentMonth}.</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((d) => {
      const itemsHtml = d.items
        ? d.items
            .map(
              (it) => `
          <span class="dispatch-item-pill">
            <strong>${it.qty} ${it.unit || ''}</strong> ${it.name} ${it.sn ? `(SN: ${it.sn})` : ''}
          </span>
        `
            )
            .join('')
        : `<span class="dispatch-item-pill">${d.itemsSummary || 'Vật tư thi công'}</span>`;

      return `
      <div class="dispatch-card">
        <div class="dispatch-header">
          <div>
            <div class="d-flex align-center gap-2">
              <span class="status-badge status-deployed">${d.id}</span>
              <span class="dispatch-title">${d.project}</span>
            </div>
            <p class="dispatch-meta">👤 KTV nhận: <strong>${d.tech}</strong> • 📅 ${d.date}</p>
          </div>
          <span class="status-badge ${d.status === 'Đang thi công' ? 'status-deploying' : 'status-in-stock'}">${d.status || 'Đã xuất kho'}</span>
        </div>
        <div class="dispatch-items-container">
          ${itemsHtml}
        </div>
      </div>
    `;
    })
    .join('');
}

// 9. INWARD & RETURN WORKFLOWS
function initInwardAndReturn() {
  const btnInward = document.getElementById('toggle-inward');
  const btnReturn = document.getElementById('toggle-return');
  const viewInward = document.getElementById('view-inward');
  const viewReturn = document.getElementById('view-return');

  btnInward.onclick = () => {
    btnInward.classList.add('active');
    btnReturn.classList.remove('active');
    viewInward.classList.add('active');
    viewReturn.classList.remove('active');
  };

  btnReturn.onclick = () => {
    btnReturn.classList.add('active');
    btnInward.classList.remove('active');
    viewReturn.classList.add('active');
    viewInward.classList.remove('active');
  };

  const inwardSelect = document.getElementById('inward-item-select');
  inwardSelect.onchange = () => {
    const item = store.inventory.find((i) => i.id === inwardSelect.value);
    if (!item) return;
    document.getElementById('inward-unit-display').textContent = item.unit;
    if (item.hasSerial) {
      document.getElementById('inward-serial-section').classList.remove('hidden');
      document.getElementById('inward-normal-section').classList.add('hidden');
    } else {
      document.getElementById('inward-serial-section').classList.add('hidden');
      document.getElementById('inward-normal-section').classList.remove('hidden');
    }
  };

  // Form Inward Submit
  document.getElementById('form-inward').onsubmit = (e) => {
    e.preventDefault();
    if (store.currentUser.role !== 'admin') return;
    const itemId = inwardSelect.value;
    const item = store.inventory.find((i) => i.id === itemId);
    if (!item) return;

    if (item.hasSerial) {
      const serialText = document.getElementById('inward-serials-input').value.trim();
      const snList = serialText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      if (snList.length === 0) {
        showToast('Vui lòng nhập ít nhất 1 mã Serial!', 'error');
        return;
      }
      snList.forEach((sn) => {
        store.serials.unshift({
          id: 'S_' + Date.now() + Math.random().toString(36).substr(2, 4),
          sn: sn,
          type: item.name,
          status: 'Trong kho',
          tech: '',
          project: '',
          updated: new Date().toISOString().slice(0, 10)
        });
      });
      item.qty += snList.length;
      showToast(`Đã nhập kho ${snList.length} thiết bị có mã Serial!`, 'success');
      document.getElementById('inward-serials-input').value = '';
    } else {
      const qty = parseInt(document.getElementById('inward-quantity').value) || 0;
      if (qty <= 0) return;
      item.qty += qty;
      showToast(`Đã cộng thêm ${qty} ${item.unit} vào kho!`, 'success');
      document.getElementById('inward-quantity').value = '';
    }

    store.save();
    renderAll();
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  };

  // Form Return Submit (Hoàn trả công trình)
  document.getElementById('form-return').onsubmit = (e) => {
    e.preventDefault();
    if (store.currentUser.role !== 'admin') return;
    const project = document.getElementById('return-project-name').value.trim();
    const itemId = document.getElementById('return-item-select').value;
    const condition = document.querySelector('input[name="return_condition"]:checked').value;
    const qty = parseInt(document.getElementById('return-quantity').value) || 1;
    const reason = document.getElementById('return-reason').value.trim();

    const item = store.inventory.find((i) => i.id === itemId);
    if (!item) return;

    if (condition === 'good') {
      item.qty += qty;
      showToast(`Hoàn trả ${qty} ${item.unit} vào kho thành công!`, 'success');
    } else {
      showToast(`Đã tiếp nhận ${qty} ${item.unit} lỗi đưa vào kho bảo hành (RMA)`, 'error');
    }

    store.returnHistory.unshift({
      id: 'R_' + Date.now(),
      date: new Date().toLocaleString('vi-VN'),
      month: store.currentMonth,
      project: project,
      item: item.name,
      qty: qty,
      unit: item.unit,
      condition: condition,
      note: reason || (condition === 'good' ? 'Vật tư thừa còn tốt' : 'Lỗi kỹ thuật')
    });

    store.save();
    renderAll();
    document.getElementById('form-return').reset();
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  };
}

function renderReturnHistory() {
  const container = document.getElementById('return-history-list');
  if (!container) return;
  if (store.returnHistory.length === 0) {
    container.innerHTML = '<p class="text-muted">Chưa có bản ghi hoàn trả nào.</p>';
    return;
  }

  container.innerHTML = store.returnHistory
    .slice(0, 5)
    .map(
      (r) => `
      <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center">
        <div>
          <strong>${r.item}</strong> (${r.qty} ${r.unit}) - ${r.condition === 'good' ? '<span class="text-success">Còn tốt</span>' : '<span class="text-danger">Bị hỏng/RMA</span>'}
          <div class="text-muted" style="font-size:0.75rem">${r.project} • ${r.date}</div>
        </div>
        <small class="text-muted">${r.note}</small>
      </div>
    `
    )
    .join('');
}

// 10. TOOLS MODULE
function initToolsModule() {
  document.getElementById('btn-quick-loan-tool').onclick = () => {
    if (store.currentUser.role !== 'admin') return;
    const select = document.getElementById('loan-tool-select');
    select.innerHTML = store.tools
      .filter((t) => t.status === 'available')
      .map((t) => `<option value="${t.id}">${t.name}</option>`)
      .join('');
    if (select.children.length === 0) {
      showToast('Tất cả dụng cụ đều đang được mượn!', 'error');
      return;
    }
    document.getElementById('modal-loan-tool').classList.add('open');
  };

  document.getElementById('form-loan-tool').onsubmit = (e) => {
    e.preventDefault();
    if (store.currentUser.role !== 'admin') return;
    const toolId = document.getElementById('loan-tool-select').value;
    const tech = document.getElementById('loan-tech-name').value.trim();
    const project = document.getElementById('loan-project').value.trim();

    const tool = store.tools.find((t) => t.id === toolId);
    if (tool) {
      tool.status = 'loaned';
      tool.borrower = tech;
      tool.project = project;
      tool.date = new Date().toLocaleDateString('vi-VN');
      store.save();
      renderAll();
      document.getElementById('modal-loan-tool').classList.remove('open');
      document.getElementById('form-loan-tool').reset();
      showToast(`Đã xuất mượn ${tool.name} cho ${tech}!`, 'success');
    }
  };
}

function renderTools() {
  const container = document.getElementById('tools-grid');
  container.innerHTML = '';

  store.tools.forEach((t) => {
    const isLoaned = t.status === 'loaned';
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div class="tool-info">
        <strong>${t.name}</strong>
        ${isLoaned ? `<span class="text-danger">Đang mượn: <strong>${t.borrower}</strong> (${t.project || 'Công trình'}) - ${t.date}</span>` : '<span class="text-success">Sẵn sàng trong kho</span>'}
      </div>
      <div class="admin-only">
        ${isLoaned ? `<button class="btn-sm btn-primary" onclick="returnTool('${t.id}')">Đã trả kho</button>` : `<button class="btn-sm" onclick="loanSpecificTool('${t.id}')">Cho mượn</button>`}
      </div>
    `;
    container.appendChild(card);
  });
}

window.returnTool = function (toolId) {
  if (store.currentUser.role !== 'admin') return;
  const tool = store.tools.find((t) => t.id === toolId);
  if (!tool) return;
  tool.status = 'available';
  tool.borrower = '';
  tool.project = '';
  tool.date = '';
  store.save();
  renderAll();
  showToast(`Đã nhận lại ${tool.name} về kho!`, 'success');
};

window.loanSpecificTool = function (toolId) {
  if (store.currentUser.role !== 'admin') return;
  const tool = store.tools.find((t) => t.id === toolId);
  if (!tool) return;
  const tech = prompt(`Nhập tên KTV mượn ${tool.name}:`, 'Kỹ thuật');
  if (!tech) return;
  const proj = prompt('Nhập công trình mang đi:');

  tool.status = 'loaned';
  tool.borrower = tech;
  tool.project = proj || 'Công trình';
  tool.date = new Date().toLocaleDateString('vi-VN');
  store.save();
  renderAll();
  showToast(`Đã ghi sổ mượn ${tool.name}`, 'success');
};

// 11. AUTHENTICATION & SECRET ADMIN ACCESS
function initAuthAndRoles() {
  // Kiểm tra kích hoạt quyền Admin qua URL param: ?admin=thukho hoặc ?admin=123
  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin');
  if (adminParam === 'thukho' || adminParam === '123') {
    store.currentUser = DEFAULT_USERS.find((u) => u.role === 'admin') || DEFAULT_USERS[0];
    localStorage.setItem('wh_admin_unlocked', 'true');
    store.save();
    showToast('👑 Đã kích hoạt quyền Quản lý kho qua liên kết bảo mật!', 'success');
  } else if (localStorage.getItem('wh_admin_unlocked') === 'true') {
    store.currentUser = DEFAULT_USERS.find((u) => u.role === 'admin') || DEFAULT_USERS[0];
  } else {
    // Mặc định: Sếp và mọi người nhận link đều vào chế độ Chỉ xem an toàn
    store.currentUser = DEFAULT_USERS.find((u) => u.role === 'viewer') || DEFAULT_USERS[1];
  }

  // Cử chỉ bí mật: Bấm liên tiếp 5 lần vào Logo để mở bảng nhập mật mã Quản trị
  let logoClickCount = 0;
  let logoClickTimer = null;
  const brandEl = document.querySelector('.brand');
  if (brandEl) {
    brandEl.style.cursor = 'pointer';
    brandEl.onclick = () => {
      logoClickCount++;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 3000);

      if (logoClickCount >= 5) {
        logoClickCount = 0;
        document.getElementById('modal-secret-admin').classList.add('open');
        document.getElementById('secret-pin-input').value = '';
        document.getElementById('secret-pin-input').focus();
      }
    };
  }

  // Xử lý form xác thực mật mã bí mật
  const formSecretAdmin = document.getElementById('form-secret-admin');
  if (formSecretAdmin) {
    formSecretAdmin.onsubmit = (e) => {
      e.preventDefault();
      const pin = document.getElementById('secret-pin-input').value.trim();
      if (pin === 'thukho' || pin === '123' || pin === 'admin') {
        store.currentUser = DEFAULT_USERS.find((u) => u.role === 'admin') || DEFAULT_USERS[0];
        localStorage.setItem('wh_admin_unlocked', 'true');
        store.save();
        applyUserRole();
        renderAll();
        document.getElementById('modal-secret-admin').classList.remove('open');
        showToast('👑 Đã mở khóa quyền Quản trị kho!', 'success');
      } else {
        showToast('Mật mã quản trị không chính xác!', 'error');
      }
    };
  }

  // Nút khóa quyền quản lý (trở về chỉ xem)
  const btnLockMode = document.getElementById('btn-lock-mode');
  if (btnLockMode) {
    btnLockMode.onclick = () => {
      localStorage.removeItem('wh_admin_unlocked');
      store.currentUser = DEFAULT_USERS.find((u) => u.role === 'viewer') || DEFAULT_USERS[1];
      store.save();
      applyUserRole();
      renderAll();
      showToast('🔒 Đã khóa lại chế độ Chỉ xem an toàn.', 'info');
    };
  }
}

function applyUserRole() {
  const isViewer = store.currentUser.role === 'viewer';
  if (isViewer) {
    document.body.classList.add('role-viewer');
  } else {
    document.body.classList.remove('role-viewer');
  }
}

// 12. GOOGLE SHEETS SYNC & MONTH SELECTION
function initGoogleSheetsSync() {
  const monthSelect = document.getElementById('select-month');
  if (monthSelect) {
    monthSelect.value = store.currentMonth;
    monthSelect.onchange = (e) => {
      store.currentMonth = e.target.value;
      store.save();
      renderAll();
      showToast(`Đang xem dữ liệu kỳ: ${store.currentMonth}`, 'info');
      if (store.sheetApiUrl) fetchFromGoogleSheet(false);
    };
  }

  // Manual Reload from Google Sheet (F5)
  document.getElementById('btn-sync-reload').onclick = () => {
    if (!store.sheetApiUrl) {
      showToast('Chưa cấu hình Google Sheet! Đang tải lại từ bộ nhớ máy.', 'info');
      renderAll();
      return;
    }
    fetchFromGoogleSheet(true);
  };

  // Push to Google Sheet
  const btnSyncPush = document.getElementById('btn-sync-push');
  if (btnSyncPush) {
    btnSyncPush.onclick = () => {
      if (!store.sheetApiUrl) {
        document.getElementById('modal-sheet-config').classList.add('open');
        showToast('Vui lòng kết nối URL Google Sheet trước!', 'error');
        return;
      }
      pushToGoogleSheet(true);
    };
  }

  // Open Config Modal
  document.getElementById('btn-sync-config').onclick = () => {
    document.getElementById('input-sheet-url').value = store.sheetApiUrl;
    document.getElementById('modal-sheet-config').classList.add('open');
  };

  // Save Config Form
  document.getElementById('form-sheet-config').onsubmit = (e) => {
    e.preventDefault();
    const url = document.getElementById('input-sheet-url').value.trim();
    store.sheetApiUrl = url;
    localStorage.setItem('wh_sheet_api_url', url);
    document.getElementById('modal-sheet-config').classList.remove('open');
    renderSyncStatus();
    if (url) {
      showToast('Đang kiểm tra kết nối Google Sheet...', 'info');
      fetchFromGoogleSheet(true);
    } else {
      showToast('Đã xóa liên kết Google Sheet (Chuyển về bộ nhớ máy)', 'info');
    }
  };
}

function renderSyncStatus() {
  const pill = document.getElementById('cloud-status-pill');
  const text = document.getElementById('cloud-status-text');
  if (!pill || !text) return;

  if (store.sheetApiUrl) {
    pill.classList.add('connected');
    text.textContent = 'Google Sheet';
  } else {
    pill.classList.remove('connected');
    text.textContent = 'Bộ nhớ máy';
  }
}

// Fetch from Google Sheet (doGet)
async function fetchFromGoogleSheet(showSuccessToast = false) {
  if (!store.sheetApiUrl) return;
  try {
    const url = `${store.sheetApiUrl}?action=load&month=${encodeURIComponent(store.currentMonth)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      if (data.inventory && data.inventory.length > 0) {
        store.inventory = data.inventory;
      }
      if (data.dispatchHistory) {
        store.dispatchHistory = data.dispatchHistory;
      }
      if (data.serials && data.serials.length > 0) {
        store.serials = data.serials;
      }
      store.save();
      renderAll();
      if (showSuccessToast) {
        showToast(`Đã đồng bộ mới nhất từ Google Sheet kỳ ${store.currentMonth}!`, 'success');
      }
    }
  } catch (err) {
    console.warn('Lỗi khi tải từ Google Sheet:', err);
    if (showSuccessToast) {
      showToast('Không thể kết nối đến Google Sheet. Đang dùng dữ liệu lưu máy.', 'error');
    }
  }
}

// Push to Google Sheet (doPost)
async function pushToGoogleSheet(showFeedback = true) {
  if (!store.sheetApiUrl) return;
  try {
    if (showFeedback) showToast('Đang lưu dữ liệu lên Google Sheet...', 'info');
    const payload = {
      month: store.currentMonth,
      inventory: store.inventory,
      dispatchHistory: store.dispatchHistory,
      serials: store.serials
    };

    const res = await fetch(store.sheetApiUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success && showFeedback) {
      showToast(`Đã lưu thành công lên sheet "${store.currentMonth}" trên Google Drive!`, 'success');
    }
  } catch (err) {
    console.warn('Lỗi khi đẩy lên Google Sheet:', err);
    if (showFeedback) {
      showToast('Lỗi khi lưu lên Google Sheet. Dữ liệu vẫn được giữ an toàn trên máy.', 'error');
    }
  }
}

// 13. MODALS & POPULATE DROPDOWNS
function initModals() {
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.onclick = () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    };
  });

  document.getElementById('btn-add-new-item').onclick = () => {
    if (store.currentUser.role !== 'admin') return;
    document.getElementById('modal-new-item').classList.add('open');
  };

  document.getElementById('btn-quick-inward').onclick = () => {
    if (store.currentUser.role !== 'admin') return;
    document.querySelector('.bottom-nav [data-tab="tab-in-out"]').click();
  };

  document.getElementById('btn-add-serial').onclick = () => {
    if (store.currentUser.role !== 'admin') return;
    document.querySelector('.bottom-nav [data-tab="tab-in-out"]').click();
    document.getElementById('inward-item-select').value = 'VT-CAM-01';
    document.getElementById('inward-item-select').dispatchEvent(new Event('change'));
  };

  document.getElementById('form-new-item').onsubmit = (e) => {
    e.preventDefault();
    if (store.currentUser.role !== 'admin') return;
    const name = document.getElementById('new-item-name').value.trim();
    const cat = document.getElementById('new-item-category').value;
    const unit = document.getElementById('new-item-unit').value;
    const initialQty = parseInt(document.getElementById('new-item-initial-qty').value) || 0;
    const min = parseInt(document.getElementById('new-item-min-stock').value) || 5;
    const loc = document.getElementById('new-item-location').value.trim();
    const note = document.getElementById('new-item-note').value.trim();
    const hasSerial = document.getElementById('new-item-has-serial').checked;

    const newItem = {
      id: 'VT-' + Date.now().toString(36).toUpperCase(),
      name,
      category: cat,
      unit,
      qty: initialQty,
      min,
      location: loc,
      note,
      hasSerial
    };

    store.inventory.push(newItem);
    store.save();
    renderAll();
    document.getElementById('modal-new-item').classList.remove('open');
    document.getElementById('form-new-item').reset();
    showToast(`Đã thêm "${name}" vào danh mục kho!`, 'success');
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  };

  document.getElementById('btn-print-slip').onclick = () => {
    window.print();
  };

  document.getElementById('btn-copy-slip').onclick = () => {
    const projectName = document.getElementById('pick-project-name').value.trim() || 'Công trình';
    const techName = document.getElementById('pick-tech-name').value.trim() || 'KTV';
    let text = `📦 PHIẾU XUẤT KHO - ${projectName}\n👤 KTV: ${techName}\n📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}\n------------------------\n`;
    store.pickingCart.forEach((p, idx) => {
      text += `${idx + 1}. ${p.name}: ${p.qty} ${p.unit} ${p.hasSerial ? '(CẦN CHECK SN)' : ''}\n`;
    });
    text += `------------------------\n* Vui lòng kiểm đủ đồ và hoàn trả dây thừa/công cụ sau khi xong!`;

    navigator.clipboard
      .writeText(text)
      .then(() => showToast('Đã sao chép nội dung phiếu! Bạn có thể dán vào Zalo/Telegram.', 'success'))
      .catch(() => showToast('Không thể sao chép tự động.', 'error'));
  };

  // Search input in history
  const historySearch = document.getElementById('history-search');
  if (historySearch) {
    historySearch.oninput = () => renderDispatchHistory();
  }
}

function populateDropdowns() {
  const pickSelect = document.getElementById('pick-add-select');
  const inwardSelect = document.getElementById('inward-item-select');
  const returnSelect = document.getElementById('return-item-select');

  const options = store.inventory
    .map((item) => `<option value="${item.id}">[${item.category}] ${item.name} (${item.unit})</option>`)
    .join('');

  if (pickSelect) pickSelect.innerHTML = options;
  if (inwardSelect) inwardSelect.innerHTML = options;
  if (returnSelect) returnSelect.innerHTML = options;
}

// 14. BACKUP & RESTORE SYSTEM
function initBackupSystem() {
  document.getElementById('btn-export-backup').onclick = () => {
    const data = {
      inventory: store.inventory,
      serials: store.serials,
      tools: store.tools,
      customKits: store.customKits,
      dispatchHistory: store.dispatchHistory,
      returnHistory: store.returnHistory,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_kho_anninh_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Đã tải tệp sao lưu dữ liệu kho!', 'success');
  };

  const fileInput = document.getElementById('file-import');
  document.getElementById('btn-import-backup').onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.inventory && imported.serials) {
          store.inventory = imported.inventory;
          store.serials = imported.serials;
          if (imported.tools) store.tools = imported.tools;
          if (imported.customKits) store.customKits = imported.customKits;
          if (imported.dispatchHistory) store.dispatchHistory = imported.dispatchHistory;
          if (imported.returnHistory) store.returnHistory = imported.returnHistory;
          store.save();
          renderAll();
          showToast('Phục hồi dữ liệu kho thành công!', 'success');
        } else {
          showToast('Tệp dữ liệu không hợp lệ.', 'error');
        }
      } catch (err) {
        showToast('Lỗi khi đọc tệp sao lưu.', 'error');
      }
    };
    reader.readAsText(file);
  };
}

// 15. TOAST NOTIFICATIONS
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
