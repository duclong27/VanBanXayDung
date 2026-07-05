// Hằng số dùng chung toàn ứng dụng: loại văn bản, trạng thái, màu badge, phân trang

export const LOAI_VAN_BAN = [
  'Công điện',
  'Luật',
  'Nghị quyết',
  'Nghị định',
  'Quyết định',
  'Thông tư',
  'Chỉ thị',
  'Công văn',
  'Văn bản khác',
  'Văn bản hợp nhất',
];

export const TRANG_THAI_HIEU_LUC = [
  'Còn hiệu lực',
  'Hết hiệu lực',
  'Sắp hết hiệu lực',
];

// Map trạng thái -> loại màu (dùng trong StatusBadge)
export const TRANG_THAI_COLOR = {
  'Còn hiệu lực': 'success',
  'Hết hiệu lực': 'danger',
  'Sắp hết hiệu lực': 'warning',
};

export const PAGE_SIZE = 10;
