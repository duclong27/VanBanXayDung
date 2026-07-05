// Badge hiển thị trạng thái hiệu lực của văn bản với màu tương ứng

import { TRANG_THAI_COLOR } from '@/lib/constants';

const COLOR_CLASSES = {
  success: 'bg-green-100 text-green-800 border border-green-200',
  danger: 'bg-red-100 text-red-800 border border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
};

export default function StatusBadge({ trangThai }) {
  const colorType = TRANG_THAI_COLOR[trangThai] ?? 'success';
  const cls = COLOR_CLASSES[colorType] ?? COLOR_CLASSES.success;

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${cls}`}>
      {trangThai ?? '—'}
    </span>
  );
}
