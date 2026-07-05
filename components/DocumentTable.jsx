// Bảng danh sách văn bản — nhận props documents[] và userId, responsive
// Số hiệu văn bản hiển thị dạng "con dấu" với font mono

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import FavoriteButton from './FavoriteButton';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

export default function DocumentTable({ documents = [], userId = null }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        Không tìm thấy văn bản nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-subtle shadow-sm">
      <table className="min-w-full divide-y divide-border-subtle text-sm">
        <thead className="bg-primary-navy">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-white/90 whitespace-nowrap">Số/Ký hiệu</th>
            <th className="px-4 py-3 text-left font-semibold text-white/90 whitespace-nowrap">Loại</th>
            <th className="px-4 py-3 text-left font-semibold text-white/90 whitespace-nowrap">Ngày ban hành</th>
            <th className="px-4 py-3 text-left font-semibold text-white/90">Trích yếu</th>
            <th className="px-4 py-3 text-left font-semibold text-white/90 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3 text-center font-semibold text-white/90 whitespace-nowrap">Yêu thích</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-bg-page transition-colors">

              {/* Cột số hiệu — "con dấu" với font mono */}
              <td className="px-4 py-3 whitespace-nowrap">
                <Link href={`/documents/${doc.id}`} className="group inline-block">
                  <span className="font-mono text-xs text-primary-navy bg-[#EEF3F8] border border-[#C5D5E8] rounded px-2 py-1 group-hover:bg-[#D8E8F5] transition-colors leading-none">
                    {doc.so_hieu ?? '—'}
                  </span>
                </Link>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-text-muted">{doc.loai_van_ban ?? '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-text-muted font-mono text-xs">{formatDate(doc.ngay_ban_hanh)}</td>
              <td className="px-4 py-3 text-gray-700 max-w-xs">
                <span className="line-clamp-2">{doc.trich_yeu ?? '—'}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge trangThai={doc.trang_thai} />
              </td>
              <td className="px-4 py-3 text-center">
                <FavoriteButton documentId={doc.id} userId={userId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
