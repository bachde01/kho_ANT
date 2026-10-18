/* ========================================================
   KHO AN NINH - CORE APPLICATION LOGIC
   Mobile & PWA Ready - Offline & Google Sheets Synced
   Multi-User Role: Quản Lý Kho (Admin) vs Ban Giám Đốc (Viewer)
   ======================================================== */

// 🌐 CẤU HÌNH LINK GOOGLE SHEET MẶC ĐỊNH CHO TẤT CẢ MỌI NGƯỜI TRUY CẬP
// Dán link Web App Google Apps Script của bạn vào giữa 2 dấu nháy bên dưới:
// (Ví dụ: 'https://script.google.com/macros/s/AKfycb.../exec')
// Khi đẩy lên GitHub, bất kỳ ai mở web cũng sẽ tự động đọc dữ liệu từ đây mà không cần gửi link riêng!
const DEFAULT_SHEET_API_URL = '';

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
  { id: 'u1', username: 'thukho', password: '123', name: 'Hoàng Văn Dỹ (Thủ kho)', role: 'admin' },
  { id: 'u2', username: 'sep', password: '123', name: 'Ban Giám Đốc & Cán Bộ Cấp Cao', role: 'viewer' }
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

const DEFAULT_DEFECTIVE = [
  {
    id: 'DEF-2610-01',
    month: '2026-10',
    date: '2026-10-16 16:30',
    itemId: 'VT-BOX-01',
    itemName: 'Box Controller báo động (Có SN)',
    hasSerial: true,
    serialNo: 'BOX-SN-8803',
    qty: 1,
    unit: 'Cái',
    sourceProject: 'Thu hồi từ Trạm C',
    errorDesc: 'Mất nguồn 12V, nghi chập IC nguồn',
    type: 'repair',
    vendorName: '',
    rmaCode: '',
    sentDate: '',
    notes: 'KTV đang kiểm tra, chờ thay tụ nguồn',
    liquidatedAt: ''
  },
  {
    id: 'DEF-2610-02',
    month: '2026-10',
    date: '2026-10-15 09:15',
    itemId: 'VT-CAM-01',
    itemName: 'Camera an ninh (Có SN)',
    hasSerial: true,
    serialNo: 'CAM-SN-2601',
    qty: 1,
    unit: 'Cái',
    sourceProject: 'Nhà kho Tân Bình',
    errorDesc: 'Hỏng cảm biến hồng ngoại ban đêm',
    type: 'warranty',
    vendorName: 'Trung tâm BH Hikvision Sài Gòn',
    rmaCode: 'RMA-HIK-2026-992',
    sentDate: '2026-10-15',
    notes: 'Đã gửi bưu điện sang hãng, hẹn trả hàng ngày 22/10',
    liquidatedAt: ''
  },
  {
    id: 'DEF-2610-03',
    month: '2026-10',
    date: '2026-10-14 11:00',
    itemId: 'VT-CB-RUNGC',
    itemName: 'Cảm biến rung cơ',
    hasSerial: false,
    serialNo: '',
    qty: 3,
    unit: 'Cái',
    sourceProject: 'Công trình cũ thu hồi',
    errorDesc: 'Rỉ sét lò xo cơ, nứt vỡ chân bắt vít không thể dùng lại',
    type: 'scrap',
    vendorName: '',
    rmaCode: '',
    sentDate: '',
    notes: 'Đề xuất thanh lý tiêu hủy đợt cuối tháng 10',
    liquidatedAt: ''
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'INV-2610-01',
    month: '2026-10',
    date: '2026-10-17 10:15',
    invoiceNo: 'HD-88912',
    supplier: 'Tổng Kho Cáp & Phụ Kiện Miền Nam',
    itemId: 'VT-DAY-CAT5',
    itemName: 'Dây cáp mạng Cat5',
    qty: 300,
    unit: 'Mét',
    amount: 1800000,
    wasOutOfStock: true,
    invoicePhoto: '',
    notes: 'Nhập bổ sung gấp do kho sắp hết cáp mạng thi công'
  },
  {
    id: 'INV-2610-02',
    month: '2026-10',
    date: '2026-10-12 14:30',
    invoiceNo: 'HD-77201',
    supplier: 'Công ty Thiết Bị An Ninh Toàn Phát',
    itemId: 'VT-TH-RJ45',
    itemName: 'Hạt mạng RJ45',
    qty: 200,
    unit: 'Hạt',
    amount: 320000,
    wasOutOfStock: false,
    invoicePhoto: '',
    notes: 'Nhập định kỳ theo tháng'
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
    this.defectiveItems = this.load('wh_defective_items', DEFAULT_DEFECTIVE);
    this.invoices = this.load('wh_invoices', DEFAULT_INVOICES);
    this.currentUser = this.load('wh_current_user', DEFAULT_USERS[0]);
    
    // Tự động nhận link Google Sheet:
    // 1. Từ tham số URL: ?sheet=... (nếu chia sẻ qua link kèm param)
    // 2. Từ DEFAULT_SHEET_API_URL cấu hình sẵn ở dòng 11 (dành cho toàn bộ người dùng web GitHub)
    // 3. Từ localStorage (nếu người dùng tự nhập trong web qua nút bánh răng cấu hình)
    const urlParams = new URLSearchParams(window.location.search);
    const querySheet = urlParams.get('sheet');
    if (querySheet) {
      this.sheetApiUrl = querySheet;
      localStorage.setItem('wh_sheet_api_url', querySheet);
    } else {
      const storedUrl = localStorage.getItem('wh_sheet_api_url');
      const lastDefault = localStorage.getItem('wh_sheet_api_url_default');
      if (DEFAULT_SHEET_API_URL && DEFAULT_SHEET_API_URL !== lastDefault) {
        // Admin vừa cập nhật DEFAULT_SHEET_API_URL mới trong code
        this.sheetApiUrl = DEFAULT_SHEET_API_URL;
        localStorage.setItem('wh_sheet_api_url', DEFAULT_SHEET_API_URL);
        localStorage.setItem('wh_sheet_api_url_default', DEFAULT_SHEET_API_URL);
      } else {
        this.sheetApiUrl = storedUrl || DEFAULT_SHEET_API_URL || '';
      }
    }

    this.currentMonth = this.load('wh_current_month', '2026-10');
    this.availableMonths = this.load('wh_available_months', ['2026-10', '2026-09', '2026-08']);
    this.pickingCart = [];
  }

  load(key, fallback) {
    try {
      let data = localStorage.getItem(key);
      if (!data && key === 'wh_custom_kits') {
        data = localStorage.getItem('wh_customKits');
      }
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
    localStorage.setItem('wh_custom_kits', JSON.stringify(this.customKits));
    localStorage.setItem('wh_customKits', JSON.stringify(this.customKits));
    localStorage.setItem('wh_dispatch_history', JSON.stringify(this.dispatchHistory));
    localStorage.setItem('wh_returns', JSON.stringify(this.returnHistory));
    localStorage.setItem('wh_defective_items', JSON.stringify(this.defectiveItems));
    localStorage.setItem('wh_invoices', JSON.stringify(this.invoices));
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

// PWA Service Worker & Tự động phát hiện phiên bản mới từ GitHub Pages
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      // Ép trình duyệt kiểm tra bản cập nhật mới trên GitHub ngay khi mở app
      reg.update();
      // Khi phát hiện file mới được đẩy lên GitHub Pages
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('✨ Đã có bản cập nhật mới từ GitHub! Đang làm mới...', 'info');
              setTimeout(() => {
                window.location.reload();
              }, 1200);
            }
          };
        }
      };
    }).catch((err) => console.log('SW registration error:', err));
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
  renderInvoices();
  renderDefectiveWarehouse();
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

  const countLow = document.getElementById('count-low');
  if (countLow) countLow.textContent = lowStock;

  const lowBadge = document.getElementById('badge-low-stock-nav');
  if (lowBadge) {
    if (lowStock > 0) {
      lowBadge.textContent = lowStock;
      lowBadge.classList.remove('hidden');
    } else {
      lowBadge.classList.add('hidden');
    }
  }

  // Cho phép bấm trực tiếp vào thẻ "Sắp hết hàng" để lọc ngay
  const statLowCard = document.querySelector('.stat-card.warning');
  if (statLowCard && !statLowCard.dataset.jumpInited) {
    statLowCard.dataset.jumpInited = 'true';
    statLowCard.style.cursor = 'pointer';
    statLowCard.title = 'Bấm để xem danh sách vật tư sắp hết hàng';
    statLowCard.onclick = () => {
      const invNav = document.querySelector('.bottom-nav [data-tab="tab-inventory"]');
      if (invNav) invNav.click();
      const lowPill = document.querySelector('[data-cat="low-stock"]');
      if (lowPill) lowPill.click();
    };
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

  const historyFilterBtns = document.querySelectorAll('#history-type-filters .filter-pill');
  historyFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      historyFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentHistoryFilter = btn.getAttribute('data-type');
      renderDispatchHistory();
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
    let matchCat = false;
    if (currentCatFilter === 'all') {
      matchCat = true;
    } else if (currentCatFilter === 'low-stock') {
      matchCat = item.qty <= item.min;
    } else {
      matchCat = item.category.includes(currentCatFilter);
    }

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
          <button class="btn-card-edit admin-only" onclick="openEditItemModal('${item.id}')">⚙️ Sửa định mức</button>
          <button class="btn-card-action" onclick="quickAddToPick('${item.id}')">+ Lấy đồ</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Mở modal điều chỉnh định mức tối thiểu & thông số vật tư
window.openEditItemModal = function (itemId) {
  if (store.currentUser.role !== 'admin') {
    showToast('Chỉ Quản lý kho mới có quyền điều chỉnh định mức vật tư!', 'error');
    return;
  }
  const item = store.inventory.find((i) => i.id === itemId);
  if (!item) return;

  document.getElementById('edit-item-id').value = item.id;
  document.getElementById('edit-item-name').value = item.name || '';
  document.getElementById('edit-item-category').value = item.category || 'Thiết bị chính';
  document.getElementById('edit-item-unit').value = item.unit || 'Cái';
  document.getElementById('edit-item-qty').value = item.qty !== undefined ? item.qty : 0;
  document.getElementById('edit-item-min').value = item.min !== undefined ? item.min : 5;
  document.getElementById('edit-item-location').value = item.location || '';
  document.getElementById('edit-item-note').value = item.note || '';

  const titleEl = document.getElementById('modal-edit-item-title');
  if (titleEl) {
    titleEl.textContent = `Cài Đặt Định Mức: ${item.name}`;
  }

  const modal = document.getElementById('modal-edit-item');
  if (modal) modal.classList.add('open');
};

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
      <div class="btn-kit-actions admin-only">
        <button class="btn-kit-btn" title="Cài đặt định lượng Kit này" onclick="openEditKitModal(event, '${kit.id}')">✏️</button>
        ${kit.isCustom ? `<button class="btn-kit-btn del" title="Xóa bộ kit này" onclick="deleteCustomKit(event, '${kit.id}')">&times;</button>` : ''}
      </div>
    `;

    card.onclick = (e) => {
      if (e.target.closest('.btn-kit-actions')) return;
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

  const projectName = document.getElementById('pick-project-name').value.trim() || 'Dự án mới';
  const customerName = document.getElementById('pick-customer-name') ? document.getElementById('pick-customer-name').value.trim() : '';
  const techName = document.getElementById('pick-tech-name').value.trim() || 'Kỹ thuật viên';
  const keeperName = document.getElementById('pick-keeper-name') ? document.getElementById('pick-keeper-name').value.trim() : 'Hoàng Văn Dỹ';
  const fullProjectName = customerName ? `${projectName} - ${customerName}` : projectName;

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
    project: fullProjectName,
    tech: techName,
    keeper: keeperName,
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
      document.getElementById('kit-editing-id').value = '';
      document.getElementById('modal-kit-title').textContent = 'Tạo Bộ Kit Mới Theo Dự Án / Yêu Cầu';
      document.getElementById('kit-name-input').value = '';
      document.getElementById('kit-desc-input').value = '';
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

  // Submit create / edit kit form
  const formCreateKit = document.getElementById('form-create-kit');
  if (formCreateKit) {
    formCreateKit.onsubmit = (e) => {
      e.preventDefault();
      const editingId = document.getElementById('kit-editing-id').value;
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

      if (editingId) {
        // Cập nhật định lượng Kit đã có
        const existingKit = store.customKits.find((k) => k.id === editingId);
        if (existingKit) {
          existingKit.name = name;
          existingKit.icon = icon;
          existingKit.desc = desc || `Gồm ${items.length} món vật tư`;
          existingKit.items = items;
          store.save();
          renderKits();
          document.getElementById('modal-create-kit').classList.remove('open');
          showToast(`Đã cập nhật định lượng Bộ Kit: "${name}"!`, 'success');
          if (store.sheetApiUrl) pushToGoogleSheet(false);
          return;
        }
      }

      // Tạo Kit mới
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
      if (store.sheetApiUrl) pushToGoogleSheet(false);
    };
  }
}

window.openEditKitModal = function (e, kitId) {
  e.stopPropagation();
  if (store.currentUser.role !== 'admin') return;
  const kit = store.customKits.find((k) => k.id === kitId);
  if (!kit) return;

  document.getElementById('kit-editing-id').value = kit.id;
  document.getElementById('modal-kit-title').textContent = 'Cài Đặt Định Lượng: ' + kit.name;
  document.getElementById('kit-name-input').value = kit.name;
  document.getElementById('kit-icon-select').value = kit.icon || '📦';
  document.getElementById('kit-desc-input').value = kit.desc || '';

  const container = document.getElementById('kit-items-builder-container');
  container.innerHTML = '';

  if (kit.items && kit.items.length > 0) {
    kit.items.forEach((it) => {
      addKitBuilderRow(it.id, it.qty);
    });
  } else {
    addKitBuilderRow();
  }

  document.getElementById('modal-create-kit').classList.add('open');
};

function addKitBuilderRow(selectedId = '', defaultQty = 1) {
  const container = document.getElementById('kit-items-builder-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'kit-builder-row';

  const options = store.inventory
    .map((item) => `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>[${item.category}] ${item.name} (${item.unit})</option>`)
    .join('');

  row.innerHTML = `
    <select class="input-field">
      ${options}
    </select>
    <input type="number" class="input-field" min="1" value="${defaultQty}" placeholder="SL">
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

// Logo Ant Lucent dạng Data URI chuẩn để in ấn và hiển thị offline không bao giờ bị lỗi
const ANT_LUCENT_LOGO_B64 = 'data:image/png;base64,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';

function openPickingSlipModal() {
  if (store.pickingCart.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 vật tư để xuất phiếu!', 'error');
    return;
  }

  const projectName = document.getElementById('pick-project-name').value.trim() || 'Dự án chưa đặt tên';
  const customerName = document.getElementById('pick-customer-name') ? document.getElementById('pick-customer-name').value.trim() : '';
  const techName = document.getElementById('pick-tech-name').value.trim() || 'Kỹ thuật viên';
  const keeperName = document.getElementById('pick-keeper-name') ? document.getElementById('pick-keeper-name').value.trim() : 'Hoàng Văn Dỹ';
  const today = new Date().toLocaleDateString('vi-VN');

  let rowsHtml = '';
  store.pickingCart.forEach((p, i) => {
    rowsHtml += `
      <tr>
        <td style="text-align:center">${i + 1}</td>
        <td><strong>${p.name}</strong> ${p.hasSerial ? '<br><small style="color:#DC2626">Ghi SN: .......................................</small>' : ''}</td>
        <td style="text-align:center">${p.qty} ${p.unit}</td>
        <td style="text-align:center">....... ${p.unit}</td>
      </tr>
    `;
  });

  const slipContent = `
    <div class="slip-container" id="printable-area">
      <!-- THÔNG TIN DOANH NGHIỆP TRÊN ĐẦU PHIẾU (THEO MẪU CÔNG TY ANT LUCENT) -->
      <div class="slip-company-header">
        <div class="slip-company-logo">
          <img src="${ANT_LUCENT_LOGO_B64}" alt="Logo Ant Lucent">
        </div>
        <div class="slip-company-info">
          <div class="slip-company-name">Công Ty Cổ Phần Công Nghệ Ant Lucent</div>
          <div class="slip-company-line">Địa chỉ : 152 Thụy Khuê , Q.Tây Hồ, Hà Nội</div>
          <div class="slip-company-line slip-company-flex">
            <span>Điện thoại :</span>
            <span>Fax : 848-4-9347503</span>
          </div>
          <div class="slip-company-line">Email : infor@jsc.com.vn</div>
          <div class="slip-company-line">Website : www.jsc.com.vn</div>
        </div>
      </div>

      <div class="slip-header">
        <h2>PHIẾU XUẤT VẬT TƯ LẮP ĐẶT</h2>
        <p style="font-size:0.85rem; color:#64748B">Hệ thống Camera Giám Sát & Controller Báo Động</p>
      </div>

      <div class="slip-meta-grid">
        <div><strong>Dự án / Công trình:</strong> ${projectName}</div>
        <div><strong>Ngày xuất kho:</strong> ${today}</div>
        <div><strong>Khách hàng:</strong> ${customerName || 'Đơn vị dự án'}</div>
        <div><strong>Thủ kho xuất hàng:</strong> ${keeperName}</div>
        <div><strong>Kỹ thuật viên phụ trách:</strong> ${techName}</div>
        <div><strong>Bộ phận:</strong> Kỹ thuật lắp đặt</div>
      </div>

      <table class="slip-table">
        <thead>
          <tr>
            <th style="width:40px; text-align:center">STT</th>
            <th>Tên vật tư / Thiết bị</th>
            <th style="width:110px; text-align:center">Yêu cầu</th>
            <th style="width:120px; text-align:center">Thực xuất</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="slip-signatures">
        <div class="sig-col">
          <div class="sig-title">KỸ THUẬT VIÊN NHẬN ĐỒ</div>
          <div class="sig-note">(Ký nhận)</div>
          <div class="sig-space"></div>
          <div class="sig-name">${techName}</div>
        </div>
        <div class="sig-col">
          <div class="sig-title">THỦ KHO XUẤT HÀNG</div>
          <div class="sig-note">(Ký nhận)</div>
          <div class="sig-space"></div>
          <div class="sig-name">${keeperName}</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('picking-slip-print-content').innerHTML = slipContent;
  document.getElementById('modal-picking-slip').classList.add('open');
}

// 8. WAREHOUSE HISTORY LOG (NHẬT KÝ XUẤT - NHẬP KHO & HÓA ĐƠN CHO BAN LÃNH ĐẠO)
let currentHistoryFilter = 'all';

function renderDispatchHistory() {
  const container = document.getElementById('dispatch-history-list');
  if (!container) return;

  const searchInput = document.getElementById('history-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // 1. Lấy dữ liệu theo kỳ tháng hiện tại
  const monthDispatches = (store.dispatchHistory || []).filter((d) => !d.month || d.month === store.currentMonth);
  const monthInwards = (store.invoices || []).filter((i) => !i.month || i.month === store.currentMonth);
  const monthReturns = (store.returnHistory || []).filter((r) => !r.month || r.month === store.currentMonth || (r.date && r.date.includes(store.currentMonth)));

  // Cập nhật thẻ KPI cho Ban Giám Đốc
  const elDispCount = document.getElementById('history-dispatch-count');
  const elInwCount = document.getElementById('history-inward-count');
  const elInwCost = document.getElementById('history-inward-total-cost');
  
  if (elDispCount) elDispCount.textContent = monthDispatches.length;
  if (elInwCount) elInwCount.textContent = monthInwards.length;
  if (elInwCost) {
    const totalCost = monthInwards.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    elInwCost.textContent = totalCost > 0 ? totalCost.toLocaleString('vi-VN') + ' đ' : '0 đ';
  }

  // 2. Gom danh sách bản ghi theo bộ lọc loại (currentHistoryFilter)
  let records = [];

  if (currentHistoryFilter === 'all' || currentHistoryFilter === 'dispatch') {
    monthDispatches.forEach((d) => records.push({ ...d, recordType: 'dispatch' }));
  }
  if (currentHistoryFilter === 'all' || currentHistoryFilter === 'inward') {
    monthInwards.forEach((i) => records.push({ ...i, recordType: 'inward' }));
  }
  if (currentHistoryFilter === 'all' || currentHistoryFilter === 'return') {
    monthReturns.forEach((r) => records.push({ ...r, recordType: 'return' }));
  }

  // 3. Lọc theo từ khóa tìm kiếm
  const filtered = records.filter((rec) => {
    if (!query) return true;
    if (rec.recordType === 'dispatch') {
      const matchProject = rec.project && rec.project.toLowerCase().includes(query);
      const matchTech = rec.tech && rec.tech.toLowerCase().includes(query);
      const matchId = rec.id && rec.id.toLowerCase().includes(query);
      const matchItems = rec.items && rec.items.some((it) => it.name.toLowerCase().includes(query) || (it.sn && it.sn.toLowerCase().includes(query)));
      return matchProject || matchTech || matchId || matchItems;
    }
    if (rec.recordType === 'inward') {
      const matchNo = rec.invoiceNo && rec.invoiceNo.toLowerCase().includes(query);
      const matchSup = rec.supplier && rec.supplier.toLowerCase().includes(query);
      const matchItem = rec.itemName && rec.itemName.toLowerCase().includes(query);
      const matchNotes = rec.notes && rec.notes.toLowerCase().includes(query);
      return matchNo || matchSup || matchItem || matchNotes;
    }
    if (rec.recordType === 'return') {
      const matchItem = rec.item && rec.item.toLowerCase().includes(query);
      const matchProj = rec.project && rec.project.toLowerCase().includes(query);
      const matchNote = rec.note && rec.note.toLowerCase().includes(query);
      return matchItem || matchProj || matchNote;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="picking-cart-empty">Không có nhật ký nào trong kỳ ${store.currentMonth} khớp với bộ lọc.</div>`;
    return;
  }

  // 4. Render danh sách thẻ
  container.innerHTML = filtered
    .map((rec) => {
      // THẺ XUẤT KHO
      if (rec.recordType === 'dispatch') {
        const itemsHtml = rec.items
          ? rec.items
              .map(
                (it) => `
            <span class="dispatch-item-pill">
              <strong>${it.qty} ${it.unit || ''}</strong> ${it.name} ${it.sn ? `(SN: ${it.sn})` : ''}
            </span>
          `
              )
              .join('')
          : `<span class="dispatch-item-pill">${rec.itemsSummary || 'Vật tư thi công'}</span>`;

        return `
        <div class="dispatch-card">
          <div class="dispatch-header">
            <div>
              <div class="d-flex align-center gap-2">
                <span class="status-badge status-deployed">📤 Xuất: ${rec.id}</span>
                <span class="dispatch-title">${rec.project}</span>
              </div>
              <p class="dispatch-meta">👤 KTV nhận: <strong>${rec.tech}</strong> • 📅 ${rec.date}</p>
            </div>
            <span class="status-badge ${rec.status === 'Đang thi công' ? 'status-deploying' : 'status-in-stock'}">${rec.status || 'Đã xuất kho'}</span>
          </div>
          <div class="dispatch-items-container">
            ${itemsHtml}
          </div>
        </div>
      `;
      }

      // THẺ NHẬP HÀNG & HÓA ĐƠN
      if (rec.recordType === 'inward') {
        const amountStr = rec.amount ? Number(rec.amount).toLocaleString('vi-VN') + ' đ' : '';
        return `
        <div class="dispatch-card inward-card">
          <div class="dispatch-header">
            <div>
              <div class="d-flex align-center gap-2">
                <span class="status-badge status-inward">📥 Nhập kho: ${rec.invoiceNo || rec.id}</span>
                <span class="dispatch-title">${rec.supplier || 'Nhà cung cấp'}</span>
                ${rec.wasOutOfStock ? '<span class="badge-out-restock">⚡ Nhập khi hết hàng</span>' : ''}
              </div>
              <p class="dispatch-meta">
                📅 ${rec.date} • Vật tư: <strong style="color:#38BDF8">${rec.itemName}</strong>
                ${amountStr ? ` • 💰 Số tiền: <strong style="color:#FBBF24">${amountStr}</strong>` : ''}
              </p>
            </div>
            <div class="d-flex align-center gap-2">
              ${rec.invoicePhoto ? `<button class="btn-card-view-invoice" onclick="openInvoiceModal('${rec.id}')">🖼️ Xem Hóa Đơn</button>` : ''}
              <span class="status-badge status-in-stock">+${rec.qty} ${rec.unit || ''}</span>
            </div>
          </div>
          ${rec.notes ? `<div class="inward-notes-text">📝 Ghi chú: ${rec.notes}</div>` : ''}
        </div>
      `;
      }

      // THẺ HOÀN TRẢ CÔNG TRÌNH
      if (rec.recordType === 'return') {
        const isGood = rec.condition === 'good';
        return `
        <div class="dispatch-card return-card">
          <div class="dispatch-header">
            <div>
              <div class="d-flex align-center gap-2">
                <span class="status-badge status-return">↩️ Hoàn trả kho</span>
                <span class="dispatch-title">${rec.project || 'Công trình hoàn trả'}</span>
                <span class="status-badge ${isGood ? 'status-in-stock' : 'status-defective'}">
                  ${isGood ? '✅ Còn tốt' : '⚠️ Bị hỏng / RMA'}
                </span>
              </div>
              <p class="dispatch-meta">📅 ${rec.date} • Vật tư: <strong style="color:#38BDF8">${rec.item}</strong> (+${rec.qty} ${rec.unit})</p>
            </div>
            <span class="status-badge status-info">+${rec.qty} ${rec.unit || ''}</span>
          </div>
          ${rec.note ? `<div class="inward-notes-text">📝 Ghi chú: ${rec.note}</div>` : ''}
        </div>
      `;
      }

      return '';
    })
    .join('');
}

// 9. INWARD, INVOICES, RETURN & DEFECTIVE (RMA) WORKFLOWS
let currentInvoicePhotoBase64 = '';
let currentDefectiveFilter = 'all';

function initInwardAndReturn() {
  const btnInward = document.getElementById('toggle-inward');
  const btnReturn = document.getElementById('toggle-return');
  const btnDefective = document.getElementById('toggle-defective');
  const viewInward = document.getElementById('view-inward');
  const viewReturn = document.getElementById('view-return');
  const viewDefective = document.getElementById('view-defective');

  const switchSubTab = (activeBtn, activeView) => {
    [btnInward, btnReturn, btnDefective].forEach((b) => b && b.classList.remove('active'));
    [viewInward, viewReturn, viewDefective].forEach((v) => v && v.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
    if (activeView) activeView.classList.add('active');
  };

  if (btnInward) btnInward.onclick = () => switchSubTab(btnInward, viewInward);
  if (btnReturn) btnReturn.onclick = () => switchSubTab(btnReturn, viewReturn);
  if (btnDefective) btnDefective.onclick = () => switchSubTab(btnDefective, viewDefective);

  // Inward Item Select Change
  const inwardSelect = document.getElementById('inward-item-select');
  if (inwardSelect) {
    inwardSelect.onchange = () => {
      const item = store.inventory.find((i) => i.id === inwardSelect.value);
      if (!item) return;
      document.getElementById('inward-unit-display').textContent = item.unit;
      
      // Serial section toggle
      if (item.hasSerial) {
        document.getElementById('inward-serial-section').classList.remove('hidden');
        document.getElementById('inward-normal-section').classList.add('hidden');
      } else {
        document.getElementById('inward-serial-section').classList.add('hidden');
        document.getElementById('inward-normal-section').classList.remove('hidden');
      }

      // Check Out of Stock / Low Stock Alert Banner
      const stockAlert = document.getElementById('inward-stock-alert');
      const badgeRestock = document.getElementById('badge-restock-status');
      if (item.qty === 0) {
        stockAlert.className = 'alert-banner alert-danger mb-3';
        stockAlert.innerHTML = `🚨 <strong>Vật tư này hiện đã HẾT HÀNG (0 ${item.unit})!</strong> Bạn đang nhập bổ sung hàng để thi công. Hãy chụp và lưu hóa đơn mua hàng để đối soát.`;
        stockAlert.classList.remove('hidden');
        if (badgeRestock) badgeRestock.classList.remove('hidden');
      } else if (item.qty <= item.min) {
        stockAlert.className = 'alert-banner alert-warning mb-3';
        stockAlert.innerHTML = `⚠️ <strong>Vật tư sắp hết hàng (${item.qty}/${item.min} ${item.unit})!</strong> Bạn đang nhập thêm bổ sung an toàn.`;
        stockAlert.classList.remove('hidden');
        if (badgeRestock) badgeRestock.classList.remove('hidden');
      } else {
        stockAlert.classList.add('hidden');
        if (badgeRestock) badgeRestock.classList.add('hidden');
      }
    };
  }

  // Invoice File Upload & Canvas Compression
  const invoiceFileInput = document.getElementById('inward-invoice-file');
  const invoicePreviewContainer = document.getElementById('invoice-preview-container');
  const invoicePreviewImg = document.getElementById('invoice-preview-img');
  const btnRemoveInvoicePhoto = document.getElementById('btn-remove-invoice-photo');

  if (invoiceFileInput) {
    invoiceFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 900;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          currentInvoicePhotoBase64 = canvas.toDataURL('image/jpeg', 0.75);
          if (invoicePreviewImg) invoicePreviewImg.src = currentInvoicePhotoBase64;
          if (invoicePreviewContainer) invoicePreviewContainer.classList.remove('hidden');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
  }

  if (btnRemoveInvoicePhoto) {
    btnRemoveInvoicePhoto.onclick = () => {
      currentInvoicePhotoBase64 = '';
      if (invoiceFileInput) invoiceFileInput.value = '';
      if (invoicePreviewContainer) invoicePreviewContainer.classList.add('hidden');
    };
  }

  if (invoicePreviewImg) {
    invoicePreviewImg.onclick = () => {
      if (currentInvoicePhotoBase64) {
        window.openInvoicePhotoPreview(currentInvoicePhotoBase64, 'Ảnh hóa đơn đang đính kèm');
      }
    };
  }

  // Form Inward Submit (Nhập kho + Lưu hóa đơn)
  const formInward = document.getElementById('form-inward');
  if (formInward) {
    formInward.onsubmit = (e) => {
      e.preventDefault();
      if (store.currentUser.role !== 'admin') return;
      const itemId = inwardSelect.value;
      const item = store.inventory.find((i) => i.id === itemId);
      if (!item) return;

      const invoiceNo = document.getElementById('inward-invoice-no').value.trim();
      const supplier = document.getElementById('inward-supplier').value.trim();
      const amount = parseInt(document.getElementById('inward-amount').value) || 0;
      const notes = document.getElementById('inward-notes').value.trim();
      const wasOut = item.qty === 0 || item.qty <= item.min;

      let addedQty = 0;

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
        addedQty = snList.length;
        document.getElementById('inward-serials-input').value = '';
      } else {
        const qty = parseInt(document.getElementById('inward-quantity').value) || 0;
        if (qty <= 0) return;
        item.qty += qty;
        addedQty = qty;
        document.getElementById('inward-quantity').value = '';
      }

      // Tạo bản ghi hóa đơn lưu trữ
      const newInvoice = {
        id: 'INV-' + Date.now(),
        month: store.currentMonth,
        date: new Date().toLocaleString('vi-VN'),
        invoiceNo: invoiceNo || ('HĐ-' + Date.now().toString().slice(-6)),
        supplier: supplier || 'Nhà cung cấp vật tư',
        itemId: item.id,
        itemName: item.name,
        qty: addedQty,
        unit: item.unit,
        amount: amount,
        wasOutOfStock: wasOut,
        invoicePhoto: currentInvoicePhotoBase64,
        notes: notes
      };

      store.invoices.unshift(newInvoice);

      // Reset invoice input
      document.getElementById('inward-invoice-no').value = '';
      document.getElementById('inward-supplier').value = '';
      document.getElementById('inward-amount').value = '';
      document.getElementById('inward-notes').value = '';
      currentInvoicePhotoBase64 = '';
      if (invoiceFileInput) invoiceFileInput.value = '';
      if (invoicePreviewContainer) invoicePreviewContainer.classList.add('hidden');

      store.save();
      renderAll();
      showToast(`Đã nhập ${addedQty} ${item.unit} "${item.name}" và lưu hóa đơn thành công!`, 'success');
      if (store.sheetApiUrl) pushToGoogleSheet(false);
    };
  }

  // Return Form Condition Radio Change
  const returnRadios = document.querySelectorAll('input[name="return_condition"]');
  const returnDefectiveOptions = document.getElementById('return-defective-options');
  returnRadios.forEach((r) => {
    r.addEventListener('change', () => {
      if (r.value === 'defective' && r.checked) {
        if (returnDefectiveOptions) returnDefectiveOptions.classList.remove('hidden');
      } else if (r.value === 'good' && r.checked) {
        if (returnDefectiveOptions) returnDefectiveOptions.classList.add('hidden');
      }
    });
  });

  // Form Return Submit (Hoàn trả công trình -> Tồn kho hoặc Kho Hỏng)
  const formReturn = document.getElementById('form-return');
  if (formReturn) {
    formReturn.onsubmit = (e) => {
      e.preventDefault();
      if (store.currentUser.role !== 'admin') return;
      const project = document.getElementById('return-project-name').value.trim();
      const itemId = document.getElementById('return-item-select').value;
      const condition = document.querySelector('input[name="return_condition"]:checked').value;
      const qty = parseInt(document.getElementById('return-quantity').value) || 1;
      const reason = document.getElementById('return-reason').value.trim();
      const defectiveDest = document.getElementById('return-defective-dest') ? document.getElementById('return-defective-dest').value : 'repair';

      const item = store.inventory.find((i) => i.id === itemId);
      if (!item) return;

      if (condition === 'good') {
        item.qty += qty;
        showToast(`Hoàn trả ${qty} ${item.unit} "${item.name}" vào tồn kho tốt!`, 'success');
      } else {
        // Tạo bản ghi trong Kho Hỏng (defectiveItems)
        const newDefective = {
          id: 'DEF-' + Date.now(),
          month: store.currentMonth,
          date: new Date().toLocaleString('vi-VN'),
          itemId: item.id,
          itemName: item.name,
          hasSerial: item.hasSerial,
          serialNo: '',
          qty: qty,
          unit: item.unit,
          sourceProject: project,
          errorDesc: reason || 'Lỗi kỹ thuật khi thi công',
          type: defectiveDest, // 'repair' | 'warranty' | 'scrap'
          vendorName: '',
          rmaCode: '',
          sentDate: '',
          notes: '',
          liquidatedAt: ''
        };

        store.defectiveItems.unshift(newDefective);

        let destName = 'Chờ sửa chữa';
        if (defectiveDest === 'warranty') destName = 'Gửi bảo hành hãng';
        else if (defectiveDest === 'scrap') destName = 'Đề xuất thanh lý';

        showToast(`Đã đưa ${qty} ${item.unit} lỗi vào Kho Hỏng (${destName})!`, 'error');
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
      formReturn.reset();
      if (returnDefectiveOptions) returnDefectiveOptions.classList.add('hidden');
      if (store.sheetApiUrl) pushToGoogleSheet(false);
    };
  }

  // Defective Filter Buttons
  const defFilters = document.querySelectorAll('#defective-status-filters .filter-pill');
  defFilters.forEach((btn) => {
    btn.onclick = () => {
      defFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentDefectiveFilter = btn.getAttribute('data-defective-filter');
      renderDefectiveWarehouse();
    };
  });

  // Modal Báo Hàng Hỏng
  const btnOpenAddDef = document.getElementById('btn-open-add-defective');
  if (btnOpenAddDef) {
    btnOpenAddDef.onclick = () => {
      const select = document.getElementById('defective-item-select');
      select.innerHTML = store.inventory
        .map((it) => `<option value="${it.id}">[${it.category}] ${it.name} (${it.unit})</option>`)
        .join('');
      document.getElementById('defective-qty').value = 1;
      document.getElementById('defective-source').value = '';
      document.getElementById('defective-reason').value = '';
      document.getElementById('modal-add-defective').classList.add('open');
    };
  }

  // Type change inside Add Defective modal
  const defTypeSelect = document.getElementById('defective-type-select');
  if (defTypeSelect) {
    defTypeSelect.onchange = () => {
      const wFields = document.getElementById('defective-warranty-fields');
      if (wFields) {
        if (defTypeSelect.value === 'warranty') wFields.classList.remove('hidden');
        else wFields.classList.add('hidden');
      }
    };
  }

  // Form Add Defective Submit
  const formAddDefective = document.getElementById('form-add-defective');
  if (formAddDefective) {
    formAddDefective.onsubmit = (e) => {
      e.preventDefault();
      if (store.currentUser.role !== 'admin') return;
      const itemId = document.getElementById('defective-item-select').value;
      const item = store.inventory.find((i) => i.id === itemId);
      if (!item) return;

      const qty = parseInt(document.getElementById('defective-qty').value) || 1;
      const type = document.getElementById('defective-type-select').value;
      const serialNo = document.getElementById('defective-serial-input').value.trim();
      const source = document.getElementById('defective-source').value.trim();
      const reason = document.getElementById('defective-reason').value.trim();
      const vendor = document.getElementById('defective-vendor') ? document.getElementById('defective-vendor').value.trim() : '';
      const rma = document.getElementById('defective-rma-code') ? document.getElementById('defective-rma-code').value.trim() : '';

      const newDef = {
        id: 'DEF-' + Date.now(),
        month: store.currentMonth,
        date: new Date().toLocaleString('vi-VN'),
        itemId: item.id,
        itemName: item.name,
        hasSerial: item.hasSerial,
        serialNo: serialNo,
        qty: qty,
        unit: item.unit,
        sourceProject: source || 'Kho nội bộ',
        errorDesc: reason,
        type: type,
        vendorName: vendor,
        rmaCode: rma,
        sentDate: type === 'warranty' ? new Date().toISOString().slice(0, 10) : '',
        notes: '',
        liquidatedAt: ''
      };

      store.defectiveItems.unshift(newDef);

      if (item.hasSerial && serialNo) {
        const ser = store.serials.find((s) => s.sn === serialNo);
        if (ser) ser.status = 'Hỏng/Bảo hành';
      }

      store.save();
      renderAll();
      document.getElementById('modal-add-defective').classList.remove('open');
      formAddDefective.reset();
      showToast(`Đã thêm "${item.name}" vào Kho Hỏng (${type})!`, 'success');
      if (store.sheetApiUrl) pushToGoogleSheet(false);
    };
  }

  // Monthly Liquidation Actions
  const btnExportLiq = document.getElementById('btn-export-liquidation');
  if (btnExportLiq) {
    btnExportLiq.onclick = exportLiquidationReport;
  }

  const btnConfirmLiq = document.getElementById('btn-confirm-liquidation');
  if (btnConfirmLiq) {
    btnConfirmLiq.onclick = handleConfirmLiquidation;
  }

  const btnCopyLiq = document.getElementById('btn-copy-liquidation');
  if (btnCopyLiq) {
    btnCopyLiq.onclick = copyLiquidationReport;
  }

  const btnPrintLiq = document.getElementById('btn-print-liquidation');
  if (btnPrintLiq) {
    btnPrintLiq.onclick = () => window.print();
  }
}

function renderInvoices() {
  const container = document.getElementById('inward-invoice-list');
  const countEl = document.getElementById('invoice-total-count');
  if (!container) return;

  const monthInvoices = store.invoices.filter((inv) => !store.currentMonth || inv.month === store.currentMonth);
  if (countEl) countEl.textContent = monthInvoices.length;

  if (monthInvoices.length === 0) {
    container.innerHTML = '<p class="text-muted text-sm" style="padding:12px 0">Chưa có hóa đơn nào được lưu trong kỳ này.</p>';
    return;
  }

  container.innerHTML = monthInvoices
    .map((inv) => {
      const amountStr = inv.amount ? inv.amount.toLocaleString('vi-VN') + ' đ' : 'Chưa nhập';
      return `
      <div class="invoice-item-card">
        <div class="d-flex align-center gap-3">
          ${inv.invoicePhoto ? `<img src="${inv.invoicePhoto}" class="invoice-thumb" onclick="openInvoiceModal('${inv.id}')" title="Bấm xem hóa đơn lớn">` : '<div style="width:48px; height:48px; background:rgba(255,255,255,0.05); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:1.4rem">🧾</div>'}
          <div>
            <div class="d-flex align-center gap-2 mb-1">
              <strong>${inv.invoiceNo}</strong>
              ${inv.wasOutOfStock ? '<span class="badge-out-restock">⚡ Nhập khi hết/sắp hết hàng</span>' : ''}
            </div>
            <div style="font-size:0.85rem; color:var(--text-main)">
              <strong>${inv.itemName}</strong>: +${inv.qty} ${inv.unit} • NCC: <strong>${inv.supplier}</strong>
            </div>
            <div class="text-muted" style="font-size:0.75rem; margin-top:3px">
              📅 ${inv.date} • Thành tiền: <strong style="color:#FBBF24">${amountStr}</strong> ${inv.notes ? `• <em>${inv.notes}</em>` : ''}
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          ${inv.invoicePhoto ? `<button class="btn-sm btn-secondary" onclick="openInvoiceModal('${inv.id}')">📸 Xem Hóa Đơn</button>` : ''}
        </div>
      </div>
    `;
    })
    .join('');
}

function renderDefectiveWarehouse() {
  const repairEl = document.getElementById('stat-defective-repair');
  const warrantyEl = document.getElementById('stat-defective-warranty');
  const scrapEl = document.getElementById('stat-defective-scrap');
  const badgeBadge = document.getElementById('count-defective-badge');
  const container = document.getElementById('defective-list-container');
  if (!container) return;

  const currentMonthItems = store.defectiveItems.filter((d) => !store.currentMonth || d.month === store.currentMonth);
  const repairItems = currentMonthItems.filter((d) => d.type === 'repair');
  const warrantyItems = currentMonthItems.filter((d) => d.type === 'warranty');
  const scrapItems = currentMonthItems.filter((d) => d.type === 'scrap');
  const totalActive = repairItems.length + warrantyItems.length + scrapItems.length;

  if (repairEl) repairEl.textContent = repairItems.length;
  if (warrantyEl) warrantyEl.textContent = warrantyItems.length;
  if (scrapEl) scrapEl.textContent = scrapItems.length;
  if (badgeBadge) badgeBadge.textContent = totalActive;

  const countAll = document.getElementById('defective-count-all');
  const countRep = document.getElementById('defective-count-repair');
  const countWar = document.getElementById('defective-count-warranty');
  const countScr = document.getElementById('defective-count-scrap');
  if (countAll) countAll.textContent = totalActive;
  if (countRep) countRep.textContent = repairItems.length;
  if (countWar) countWar.textContent = warrantyItems.length;
  if (countScr) countScr.textContent = scrapItems.length;

  const liqMonth = document.getElementById('liquidation-month-label');
  const liqCount = document.getElementById('liquidation-pending-count');
  if (liqMonth) liqMonth.textContent = store.currentMonth;
  if (liqCount) liqCount.textContent = scrapItems.length;

  let displayItems = currentMonthItems;
  if (currentDefectiveFilter === 'all') {
    displayItems = currentMonthItems.filter((d) => d.type !== 'liquidated');
  } else if (currentDefectiveFilter === 'liquidated') {
    displayItems = currentMonthItems.filter((d) => d.type === 'liquidated');
  } else {
    displayItems = currentMonthItems.filter((d) => d.type === currentDefectiveFilter);
  }

  if (displayItems.length === 0) {
    container.innerHTML = '<div class="picking-cart-empty">Không có thiết bị/vật tư nào trong danh mục này.</div>';
    return;
  }

  container.innerHTML = displayItems
    .map((d) => {
      let typeBadge = '';
      let typeClass = d.type;
      if (d.type === 'repair') typeBadge = '🔧 Sửa Chữa Nội Bộ';
      else if (d.type === 'warranty') typeBadge = '🛡️ Bảo Hành Hãng';
      else if (d.type === 'scrap') typeBadge = '🗑️ Chờ Thanh Lý';
      else if (d.type === 'liquidated') typeBadge = '📁 Đã Thanh Lý Xóa Kho';

      return `
      <div class="defective-card ${typeClass}">
        <div class="defective-header">
          <div>
            <span class="defective-badge-type ${typeClass}">${typeBadge}</span>
            <h3 style="font-size:0.95rem; font-weight:700; margin-top:6px; color:var(--text-main)">${d.itemName}</h3>
            ${d.serialNo ? `<span class="serial-code" style="font-size:0.85rem">SN: ${d.serialNo}</span>` : ''}
          </div>
          <div style="text-align:right">
            <strong style="font-size:1.15rem; color:var(--text-main)">${d.qty}</strong> <small class="text-muted">${d.unit}</small>
          </div>
        </div>

        <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5">
          <div>📍 Nguồn: <strong>${d.sourceProject || 'Kho'}</strong> • 📅 Tiếp nhận: ${d.date}</div>
          <div style="color:#FB7185; margin-top:2px">⚠️ Lỗi: <strong>${d.errorDesc}</strong></div>
          ${d.vendorName ? `<div style="color:#38BDF8; margin-top:2px">🏢 Hãng: <strong>${d.vendorName}</strong> ${d.rmaCode ? `(Mã BH: ${d.rmaCode})` : ''} ${d.sentDate ? `• Gửi ngày: ${d.sentDate}` : ''}</div>` : ''}
          ${d.notes ? `<div class="text-muted mt-1">📝 Ghi chú: ${d.notes}</div>` : ''}
          ${d.liquidatedAt ? `<div class="text-muted mt-1" style="color:#94A3B8">🗑️ Đã chốt thanh lý xóa kho vào: ${d.liquidatedAt}</div>` : ''}
        </div>

        <div class="defective-actions admin-only">
          ${
            d.type === 'repair'
              ? `
            <button class="btn-sm btn-primary" onclick="markDefectiveRepaired('${d.id}')">✅ Sửa Xong -> Nhập Kho</button>
            <button class="btn-sm btn-secondary" onclick="moveDefectiveToWarranty('${d.id}')">🛡️ Mang Đi Hãng BH</button>
            <button class="btn-sm text-danger" onclick="moveDefectiveToScrap('${d.id}')">🗑️ Báo Thanh Lý</button>
          `
              : d.type === 'warranty'
              ? `
            <button class="btn-sm btn-primary" onclick="receiveWarrantyFromVendor('${d.id}')">📦 Hãng Trả Hàng -> Nhập Kho</button>
            <button class="btn-sm btn-secondary" onclick="editWarrantyInfo('${d.id}')">📝 Sửa Thông Tin BH</button>
            <button class="btn-sm text-danger" onclick="moveDefectiveToScrap('${d.id}')">🗑️ Hãng Từ Chối -> Thanh Lý</button>
          `
              : d.type === 'scrap'
              ? `
            <button class="btn-sm text-danger" onclick="liquidateSingleItem('${d.id}')">🗑️ Thanh Lý Món Này</button>
            <button class="btn-sm btn-secondary" onclick="moveDefectiveToRepair('${d.id}')">🔧 Chuyển Lại Sửa Chữa</button>
          `
              : ''
          }
        </div>
      </div>
    `;
    })
    .join('');
}

// Thao tác Kho hỏng: 1. Sửa chữa xong -> Nhập kho
window.markDefectiveRepaired = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;

  if (confirm(`Xác nhận thiết bị "${def.itemName}" (${def.qty} ${def.unit}) đã sửa chữa tốt và đưa trở lại vào Tồn kho khả dụng?`)) {
    const item = store.inventory.find((i) => i.id === def.itemId);
    if (item) {
      item.qty += def.qty;
    }
    if (def.hasSerial && def.serialNo) {
      const ser = store.serials.find((s) => s.sn === def.serialNo);
      if (ser) {
        ser.status = 'Trong kho';
        ser.project = '';
        ser.tech = '';
      }
    }
    store.defectiveItems = store.defectiveItems.filter((d) => d.id !== defId);
    store.save();
    renderAll();
    showToast(`✅ Đã nhập trả ${def.qty} ${def.unit} "${def.itemName}" vào Tồn kho khả dụng!`, 'success');
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  }
};

// Thao tác Kho hỏng: 2. Chuyển sang Gửi Hãng Bảo Hành
window.moveDefectiveToWarranty = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;

  const vendor = prompt('Nhập tên Hãng / Trung tâm bảo hành tiếp nhận:', def.vendorName || 'Trung tâm bảo hành NSX');
  if (!vendor) return;
  const rma = prompt('Nhập mã số phiếu bảo hành / số biên nhận hãng (nếu có):', def.rmaCode || '');

  def.type = 'warranty';
  def.vendorName = vendor.trim();
  def.rmaCode = rma ? rma.trim() : '';
  def.sentDate = new Date().toISOString().slice(0, 10);
  store.save();
  renderAll();
  showToast(`Đã chuyển "${def.itemName}" sang danh mục Đang gửi Hãng bảo hành!`, 'info');
  if (store.sheetApiUrl) pushToGoogleSheet(false);
};

// Thao tác Kho hỏng: 3. Hãng đã trả hàng bảo hành về -> Nhập kho
window.receiveWarrantyFromVendor = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;

  const item = store.inventory.find((i) => i.id === def.itemId);
  const isSerial = def.hasSerial && def.serialNo;

  if (isSerial) {
    let promptMsg = `Hãng đã trả hàng bảo hành "${def.itemName}".\nThiết bị cũ mã SN: ${def.serialNo}.\n\nHãng trả lại thiết bị cũ đã sửa hay đổi Serial mới?\n- Bấm OK để giữ nguyên Serial cũ (${def.serialNo})\n- Hoặc nhập mã Serial MỚI nếu hãng đổi bảo hành mới:`;
    const newSn = prompt(promptMsg, def.serialNo);
    if (newSn === null) return;

    if (newSn.trim() && newSn.trim() !== def.serialNo) {
      const oldSer = store.serials.find((s) => s.sn === def.serialNo);
      if (oldSer) oldSer.status = 'Đã thanh lý';
      store.serials.unshift({
        id: 'S_' + Date.now(),
        sn: newSn.trim(),
        type: def.itemName,
        status: 'Trong kho',
        tech: '',
        project: 'Đổi mới từ hãng ' + (def.vendorName || ''),
        updated: new Date().toISOString().slice(0, 10)
      });
    } else {
      const ser = store.serials.find((s) => s.sn === def.serialNo);
      if (ser) ser.status = 'Trong kho';
    }
  }

  if (item) item.qty += def.qty;
  store.defectiveItems = store.defectiveItems.filter((d) => d.id !== defId);
  store.save();
  renderAll();
  showToast(`✅ Đã nhận hàng từ hãng và nhập vào kho thành công!`, 'success');
  if (store.sheetApiUrl) pushToGoogleSheet(false);
};

// Thao tác Kho hỏng: 4. Sửa thông tin gửi hãng
window.editWarrantyInfo = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;
  const vendor = prompt('Cập nhật tên Hãng / TTBH:', def.vendorName || '');
  if (vendor === null) return;
  const rma = prompt('Cập nhật mã phiếu gửi hãng:', def.rmaCode || '');
  def.vendorName = vendor.trim();
  def.rmaCode = rma ? rma.trim() : '';
  store.save();
  renderAll();
  showToast('Đã cập nhật thông tin bảo hành hãng!', 'success');
};

// Thao tác Kho hỏng: 5. Chuyển sang chờ thanh lý
window.moveDefectiveToScrap = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;
  const reason = prompt('Nhập lý do không thể sửa chữa / Hãng từ chối BH để đưa vào danh mục thanh lý:', def.notes || 'Hư hỏng nặng không thể phục hồi');
  if (reason === null) return;
  def.type = 'scrap';
  def.notes = reason.trim();
  store.save();
  renderAll();
  showToast(`Đã chuyển "${def.itemName}" vào danh sách Chờ thanh lý!`, 'info');
  if (store.sheetApiUrl) pushToGoogleSheet(false);
};

// Thao tác Kho hỏng: 6. Chuyển lại sửa chữa
window.moveDefectiveToRepair = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;
  def.type = 'repair';
  store.save();
  renderAll();
  showToast(`Đã chuyển lại "${def.itemName}" về danh mục Chờ sửa chữa.`, 'info');
};

// Thao tác Kho hỏng: 7. Thanh lý đơn lẻ
window.liquidateSingleItem = function (defId) {
  if (store.currentUser.role !== 'admin') return;
  const def = store.defectiveItems.find((d) => d.id === defId);
  if (!def) return;

  if (confirm(`Xác nhận thanh lý tiêu hủy món "${def.itemName}" (${def.qty} ${def.unit}) và xóa khỏi kho?`)) {
    def.type = 'liquidated';
    def.liquidatedAt = new Date().toLocaleString('vi-VN');
    if (def.hasSerial && def.serialNo) {
      const ser = store.serials.find((s) => s.sn === def.serialNo);
      if (ser) ser.status = 'Đã thanh lý';
    }
    store.save();
    renderAll();
    showToast(`🗑️ Đã ghi nhận thanh lý "${def.itemName}"!`, 'info');
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  }
};

// 8. Báo Cáo Thanh Lý Hàng Tháng
function exportLiquidationReport() {
  const scrapItems = store.defectiveItems.filter((d) => d.type === 'scrap' && (!store.currentMonth || d.month === store.currentMonth));
  const container = document.getElementById('liquidation-report-print-content');
  if (!container) return;

  if (scrapItems.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-muted">Kỳ <strong>${store.currentMonth}</strong> hiện không có vật tư nào trong danh sách Chờ thanh lý.</div>`;
  } else {
    let rowsHtml = scrapItems
      .map(
        (it, idx) => `
      <tr>
        <td style="padding:8px; border:1px solid #334155; text-align:center">${idx + 1}</td>
        <td style="padding:8px; border:1px solid #334155"><strong>${it.itemName}</strong> ${it.serialNo ? `<br><small class="text-muted">SN: ${it.serialNo}</small>` : ''}</td>
        <td style="padding:8px; border:1px solid #334155; text-align:center">${it.qty} ${it.unit}</td>
        <td style="padding:8px; border:1px solid #334155">${it.sourceProject || 'Kho'}</td>
        <td style="padding:8px; border:1px solid #334155; color:#FB7185">${it.errorDesc}</td>
        <td style="padding:8px; border:1px solid #334155">${it.notes || 'Không thể phục hồi'}</td>
      </tr>
    `
      )
      .join('');

    container.innerHTML = `
      <div style="padding:16px; font-family:inherit">
        <!-- THÔNG TIN DOANH NGHIỆP TRÊN ĐẦU BIÊN BẢN (THEO MẪU CÔNG TY ANT LUCENT) -->
        <div class="slip-company-header" style="border-bottom: 1.5px solid #334155; margin-bottom: 16px;">
          <div class="slip-company-logo">
            <img src="${ANT_LUCENT_LOGO_B64}" alt="Logo Ant Lucent">
          </div>
          <div class="slip-company-info">
            <div class="slip-company-name" style="color:#F8FAFC">Công Ty Cổ Phần Công Nghệ Ant Lucent</div>
            <div class="slip-company-line" style="color:#CBD5E1">Địa chỉ : 152 Thụy Khuê , Q.Tây Hồ, Hà Nội</div>
            <div class="slip-company-line slip-company-flex" style="color:#CBD5E1">
              <span>Điện thoại :</span>
              <span>Fax : 848-4-9347503</span>
            </div>
            <div class="slip-company-line" style="color:#CBD5E1">Email : infor@jsc.com.vn | Website : www.jsc.com.vn</div>
          </div>
        </div>

        <div style="text-align:center; margin-bottom:16px">
          <h2 style="font-size:1.15rem; color:#F1F5F9; margin-bottom:4px">BIÊN BẢN ĐỀ XUẤT THANH LÝ VẬT TƯ HỎNG</h2>
          <p style="font-size:0.85rem; color:#94A3B8">Kỳ kiểm kê & báo cáo: <strong>${store.currentMonth}</strong> • Ngày lập: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:0.8rem; margin-bottom:20px; color:#E2E8F0">
          <thead>
            <tr style="background:#1E293B">
              <th style="padding:8px; border:1px solid #334155">STT</th>
              <th style="padding:8px; border:1px solid #334155">Tên Vật Tư / Thiết Bị</th>
              <th style="padding:8px; border:1px solid #334155">Số Lượng</th>
              <th style="padding:8px; border:1px solid #334155">Nguồn Gốc</th>
              <th style="padding:8px; border:1px solid #334155">Tình Trạng Hư Hỏng</th>
              <th style="padding:8px; border:1px solid #334155">Lý Do Đề Xuất</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; margin-top:30px; font-size:0.85rem; text-align:center">
          <div>
            <strong>NGƯỜI LẬP BIÊN BẢN</strong><br>
            <span class="text-muted">(Quản lý kho)</span><br><br><br>
            <strong>${store.currentUser.name}</strong>
          </div>
          <div>
            <strong>BAN GIÁM ĐỐC PHÊ DUYỆT</strong><br>
            <span class="text-muted">(Ký & ghi rõ họ tên)</span><br><br><br>
            <em>(Đã xem & duyệt thanh lý)</em>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById('modal-liquidation-report').classList.add('open');
}

function handleConfirmLiquidation() {
  if (store.currentUser.role !== 'admin') return;
  const scrapItems = store.defectiveItems.filter((d) => d.type === 'scrap' && (!store.currentMonth || d.month === store.currentMonth));
  if (scrapItems.length === 0) {
    showToast('Không có vật tư nào đang chờ thanh lý trong tháng này!', 'info');
    return;
  }

  if (confirm(`Xác nhận Ban Giám Đốc đã duyệt thanh lý toàn bộ ${scrapItems.length} món hỏng trong kỳ ${store.currentMonth}?\n\nToàn bộ các món này sẽ được chuyển vào Sổ Đã Thanh Lý và xóa khỏi danh mục theo dõi hàng hỏng.`)) {
    const timeNow = new Date().toLocaleString('vi-VN');
    scrapItems.forEach((d) => {
      d.type = 'liquidated';
      d.liquidatedAt = timeNow;
      if (d.hasSerial && d.serialNo) {
        const ser = store.serials.find((s) => s.sn === d.serialNo);
        if (ser) ser.status = 'Đã thanh lý';
      }
    });

    store.save();
    renderAll();
    showToast(`🗑️ Đã chốt thanh lý ${scrapItems.length} món và xóa khỏi kho hỏng!`, 'success');
    if (store.sheetApiUrl) pushToGoogleSheet(false);
  }
}

function copyLiquidationReport() {
  const scrapItems = store.defectiveItems.filter((d) => d.type === 'scrap' && (!store.currentMonth || d.month === store.currentMonth));
  if (scrapItems.length === 0) return;

  let text = `📋 BIÊN BẢN ĐỀ XUẤT THANH LÝ VẬT TƯ HỎNG - KỲ ${store.currentMonth}\n`;
  text += `👤 Quản lý kho: ${store.currentUser.name}\n`;
  text += `📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}\n------------------------\n`;
  scrapItems.forEach((it, idx) => {
    text += `${idx + 1}. ${it.itemName} (${it.qty} ${it.unit}) ${it.serialNo ? `[SN: ${it.serialNo}]` : ''} - Lỗi: ${it.errorDesc}\n`;
  });
  text += `------------------------\nKính trình Ban Giám Đốc xem xét và phê duyệt thanh lý xóa sổ khỏi kho!`;

  navigator.clipboard
    .writeText(text)
    .then(() => showToast('Đã sao chép nội dung biên bản thanh lý!', 'success'))
    .catch(() => showToast('Không thể sao chép tự động.', 'error'));
}

// 9. Invoice Modal Viewer
window.openInvoiceModal = function (invId) {
  const inv = store.invoices.find((i) => i.id === invId);
  if (!inv) return;

  const contentEl = document.getElementById('modal-invoice-body-content');
  const titleEl = document.getElementById('modal-invoice-title');
  if (titleEl) titleEl.textContent = `Hóa Đơn: ${inv.invoiceNo} (${inv.supplier})`;

  const amountStr = inv.amount ? inv.amount.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa nhập số tiền';

  contentEl.innerHTML = `
    <div style="font-size:0.88rem; line-height:1.6">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; background:rgba(255,255,255,0.03); padding:12px; border-radius:8px">
        <div>
          <span class="text-muted block text-xs">Số hóa đơn / Phiếu mua:</span>
          <strong style="color:#38BDF8">${inv.invoiceNo}</strong>
        </div>
        <div>
          <span class="text-muted block text-xs">Nhà cung cấp / Đơn vị bán:</span>
          <strong>${inv.supplier}</strong>
        </div>
        <div>
          <span class="text-muted block text-xs">Vật tư nhập:</span>
          <strong>${inv.itemName} (+${inv.qty} ${inv.unit})</strong>
        </div>
        <div>
          <span class="text-muted block text-xs">Tổng tiền thanh toán:</span>
          <strong style="color:#FBBF24">${amountStr}</strong>
        </div>
        <div>
          <span class="text-muted block text-xs">Ngày nhập:</span>
          <span>${inv.date} (Kỳ ${inv.month})</span>
        </div>
        <div>
          <span class="text-muted block text-xs">Trạng thái kho lúc nhập:</span>
          <span>${inv.wasOutOfStock ? '<span class="badge-out-restock">⚡ Nhập khi hết/sắp hết hàng</span>' : 'Nhập bổ sung định kỳ'}</span>
        </div>
      </div>
      ${inv.notes ? `<p class="mb-3"><strong>Ghi chú:</strong> ${inv.notes}</p>` : ''}
      
      <div style="margin-top:10px">
        <strong style="display:block; margin-bottom:8px">Ảnh chụp hóa đơn chứng từ:</strong>
        ${
          inv.invoicePhoto
            ? `<div style="text-align:center; background:#000; padding:10px; border-radius:8px">
            <img src="${inv.invoicePhoto}" id="modal-invoice-photo-view" style="max-width:100%; max-height:480px; object-fit:contain; border-radius:4px" alt="Ảnh hóa đơn">
          </div>`
            : '<p class="text-muted text-sm">Chưa đính kèm ảnh chụp hóa đơn cho đợt nhập này.</p>'
        }
      </div>
    </div>
  `;

  const btnDl = document.getElementById('btn-download-invoice-photo');
  if (btnDl) {
    if (inv.invoicePhoto) {
      btnDl.style.display = 'inline-block';
      btnDl.onclick = () => {
        const a = document.createElement('a');
        a.href = inv.invoicePhoto;
        a.download = `hoadon_${inv.invoiceNo}_${inv.month}.jpg`;
        a.click();
      };
    } else {
      btnDl.style.display = 'none';
    }
  }

  document.getElementById('modal-view-invoice').classList.add('open');
};

window.openInvoicePhotoPreview = function (dataUrl, title) {
  const modal = document.getElementById('modal-view-invoice');
  const titleEl = document.getElementById('modal-invoice-title');
  const contentEl = document.getElementById('modal-invoice-body-content');
  if (titleEl) titleEl.textContent = title || 'Xem Ảnh Hóa Đơn';
  contentEl.innerHTML = `
    <div style="text-align:center; background:#000; padding:10px; border-radius:8px">
      <img src="${dataUrl}" style="max-width:100%; max-height:500px; object-fit:contain; border-radius:4px">
    </div>
  `;
  const btnDl = document.getElementById('btn-download-invoice-photo');
  if (btnDl) {
    btnDl.onclick = () => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `hoadon_preview.jpg`;
      a.click();
    };
  }
  modal.classList.add('open');
};

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
      if (data.defectiveItems) {
        store.defectiveItems = data.defectiveItems;
      }
      if (data.invoices) {
        store.invoices = data.invoices;
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
      serials: store.serials,
      defectiveItems: store.defectiveItems,
      invoices: store.invoices
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

  // Form chỉnh sửa định mức tối thiểu & thông số vật tư
  const formEditItem = document.getElementById('form-edit-item');
  if (formEditItem) {
    formEditItem.onsubmit = (e) => {
      e.preventDefault();
      if (store.currentUser.role !== 'admin') {
        showToast('Chỉ Quản lý kho mới có quyền lưu chỉnh sửa!', 'error');
        return;
      }
      const itemId = document.getElementById('edit-item-id').value;
      const item = store.inventory.find((i) => i.id === itemId);
      if (!item) return;

      item.name = document.getElementById('edit-item-name').value.trim();
      item.category = document.getElementById('edit-item-category').value;
      item.unit = document.getElementById('edit-item-unit').value.trim();
      item.qty = parseInt(document.getElementById('edit-item-qty').value) || 0;
      item.min = parseInt(document.getElementById('edit-item-min').value) || 0;
      item.location = document.getElementById('edit-item-location').value.trim();
      item.note = document.getElementById('edit-item-note').value.trim();

      store.save();
      renderAll();
      document.getElementById('modal-edit-item').classList.remove('open');
      showToast(`Đã lưu định mức tối thiểu & thông số cho "${item.name}"!`, 'success');
      if (store.sheetApiUrl) pushToGoogleSheet(false);
    };
  }

  document.getElementById('btn-print-slip').onclick = () => {
    window.print();
  };

  document.getElementById('btn-copy-slip').onclick = () => {
    const projectName = document.getElementById('pick-project-name').value.trim() || 'Dự án';
    const customerName = document.getElementById('pick-customer-name') ? document.getElementById('pick-customer-name').value.trim() : '';
    const techName = document.getElementById('pick-tech-name').value.trim() || 'KTV';
    const keeperName = document.getElementById('pick-keeper-name') ? document.getElementById('pick-keeper-name').value.trim() : 'Hoàng Văn Dỹ';

    let text = `📦 PHIẾU XUẤT VẬT TƯ LẮP ĐẶT\nCông Ty Cổ Phần Công Nghệ Ant Lucent\n`;
    text += `🏢 Dự án: ${projectName}\n`;
    if (customerName) text += `👥 Khách hàng: ${customerName}\n`;
    text += `👤 KTV nhận đồ: ${techName}\n`;
    text += `📦 Thủ kho xuất hàng: ${keeperName}\n`;
    text += `📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}\n------------------------\n`;
    store.pickingCart.forEach((p, idx) => {
      text += `${idx + 1}. ${p.name}: Yêu cầu ${p.qty} ${p.unit} ${p.hasSerial ? '(CẦN CHECK SN)' : ''}\n`;
    });
    text += `------------------------\n* KTV vui lòng kiểm đủ thiết bị và ký xác nhận!`;

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
      defectiveItems: store.defectiveItems,
      invoices: store.invoices,
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
          if (imported.defectiveItems) store.defectiveItems = imported.defectiveItems;
          if (imported.invoices) store.invoices = imported.invoices;
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
