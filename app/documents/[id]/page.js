// Trang chi tiết văn bản — Server Component, hiển thị đầy đủ thông tin 1 văn bản

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { getDocumentById } from '@/lib/documents';
import StatusBadge from '@/components/StatusBadge';
import FavoriteButton from '@/components/FavoriteButton';
import Link from 'next/link';
import { FileDown, ArrowLeft } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const doc = await getDocumentById(supabase, id);
  return {
    title: doc ? `${doc.so_hieu ?? doc.ten_van_ban} | Pháp lý Xây dựng` : 'Không tìm thấy văn bản',
  };
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-2.5 pr-4 text-sm font-medium text-gray-500 whitespace-nowrap w-44 align-top">{label}</td>
      <td className="py-2.5 text-sm text-gray-800">{value}</td>
    </tr>
  );
}

export default async function DocumentDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [doc, { data: { user } }] = await Promise.all([
    getDocumentById(supabase, id),
    supabase.auth.getUser(),
  ]);

  if (!doc) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Không tìm thấy văn bản.</p>
        <Link href="/documents" className="text-blue-600 hover:underline text-sm">
          ← Quay về danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Link href="/documents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
        <ArrowLeft size={14} />
        Danh sách văn bản
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Tiêu đề */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-snug">
              {doc.ten_van_ban ?? 'Văn bản pháp lý'}
            </h1>
            {doc.so_hieu && (
              <p className="text-sm text-gray-500 mt-1">Số/Ký hiệu: <span className="font-medium text-gray-700">{doc.so_hieu}</span></p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge trangThai={doc.trang_thai} />
            <FavoriteButton documentId={doc.id} userId={user?.id ?? null} />
          </div>
        </div>

        {/* Bảng thông tin */}
        <table className="w-full mb-6">
          <tbody>
            <Row label="Loại văn bản" value={doc.loai_van_ban} />
            <Row label="Cơ quan ban hành" value={doc.co_quan_ban_hanh} />
            <Row label="Ngày ban hành" value={formatDate(doc.ngay_ban_hanh)} />
            <Row label="Ngày hiệu lực" value={formatDate(doc.ngay_hieu_luc)} />
            <Row label="Trạng thái" value={<StatusBadge trangThai={doc.trang_thai} />} />
            <Row label="Người ký" value={doc.nguoi_ky} />
            <Row label="Chức vụ" value={doc.chuc_vu} />
            <Row label="Lĩnh vực" value={doc.linh_vuc} />
          </tbody>
        </table>

        {/* Trích yếu */}
        {doc.trich_yeu && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Trích yếu</h2>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
              {doc.trich_yeu}
            </p>
          </div>
        )}

        {/* Nội dung */}
        {doc.noi_dung && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Nội dung</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100 max-h-96 overflow-y-auto">
              {doc.noi_dung}
            </div>
          </div>
        )}

        {/* Tệp đính kèm */}
        {doc.file_url && (
          <a
            href={doc.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            <FileDown size={16} />
            Tải văn bản gốc
          </a>
        )}
      </div>
    </div>
  );
}
