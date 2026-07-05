// Sidebar Server Component: thống kê tổng hợp + danh sách văn bản mới nhất
// Header khối dùng nền navy, số liệu thống kê dùng font mono cỡ lớn

import Link from 'next/link';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function Sidebar({ stats = {}, recentDocuments = [] }) {
  const { total = 0, conHieuLuc = 0, hetHieuLuc = 0 } = stats;

  return (
    <aside className="space-y-4">

      {/* Thống kê */}
      <div className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-sm">
        <div className="bg-primary-navy px-4 py-2.5">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Thống kê</h2>
        </div>
        <ul className="divide-y divide-border-subtle">
          <li className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-text-muted">Tổng số văn bản</span>
            <span className="font-mono text-lg font-bold text-primary-navy">
              {total.toLocaleString('vi-VN')}
            </span>
          </li>
          <li className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-green-700">Còn hiệu lực</span>
            <span className="font-mono text-lg font-bold text-green-700">
              {conHieuLuc.toLocaleString('vi-VN')}
            </span>
          </li>
          <li className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-red-600">Hết hiệu lực</span>
            <span className="font-mono text-lg font-bold text-red-600">
              {hetHieuLuc.toLocaleString('vi-VN')}
            </span>
          </li>
        </ul>
      </div>

      {/* Văn bản mới cập nhật */}
      <div className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-sm">
        <div className="bg-primary-navy px-4 py-2.5">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Mới cập nhật</h2>
        </div>
        <div className="p-4">
          {recentDocuments.length === 0 ? (
            <p className="text-xs text-text-muted">Chưa có dữ liệu.</p>
          ) : (
            <ul className="space-y-3">
              {recentDocuments.map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-sm text-primary-navy-light hover:text-primary-navy hover:underline line-clamp-2 leading-snug block transition-colors"
                  >
                    {doc.so_hieu ? `${doc.so_hieu} - ` : ''}{doc.ten_van_ban}
                  </Link>
                  {doc.ngay_ban_hanh && (
                    <span className="text-xs text-text-muted font-mono">{formatDate(doc.ngay_ban_hanh)}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
