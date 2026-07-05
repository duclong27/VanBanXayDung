// Trang danh sách văn bản — Server Component, đọc searchParams, layout 2 cột

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { getDocuments, getStats, getRecentDocuments } from '@/lib/documents';
import { PAGE_SIZE } from '@/lib/constants';
import SearchFilters from '@/components/SearchFilters';
import DocumentTable from '@/components/DocumentTable';
import Pagination from '@/components/Pagination';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Danh sách văn bản | Pháp lý Xây dựng',
};

export default async function DocumentsPage({ searchParams }) {
  const params = await searchParams;

  const search = params.search ?? '';
  const loaiVanBan = params.loaiVanBan ?? '';
  const coQuanBanHanh = params.coQuanBanHanh ?? '';
  const trangThai = params.trangThai ?? '';
  const tuNgay = params.tuNgay ?? '';
  const denNgay = params.denNgay ?? '';
  const sortBy = params.sortBy ?? 'moi_nhat';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const supabase = await createClient();

  // Lấy user hiện tại để truyền userId xuống DocumentTable
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch song song để tối ưu thời gian tải
  const [{ data: documents, count }, stats, recentDocuments] = await Promise.all([
    getDocuments(supabase, { search, loaiVanBan, coQuanBanHanh, trangThai, tuNgay, denNgay, sortBy, page, pageSize: PAGE_SIZE }),
    getStats(supabase),
    getRecentDocuments(supabase),
  ]);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Cột trái — bộ lọc + bảng + phân trang */}
      <div className="flex-1 min-w-0">
        <SearchFilters />

        <div className="mb-2 text-sm text-gray-500">
          Tìm thấy <span className="font-semibold text-gray-800">{count?.toLocaleString('vi-VN')}</span> văn bản
          {search ? ` cho "${search}"` : ''}
        </div>

        <DocumentTable documents={documents} userId={user?.id ?? null} />

        <Pagination currentPage={page} totalPages={totalPages} />
      </div>

      {/* Cột phải — sidebar */}
      <div className="lg:w-64 xl:w-72 flex-shrink-0">
        <Sidebar stats={stats} recentDocuments={recentDocuments} />
      </div>
    </div>
  );
}
