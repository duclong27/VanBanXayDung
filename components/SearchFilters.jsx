'use client';
// Bộ lọc tìm kiếm — cập nhật URL query params để Server Component cha tự re-fetch

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LOAI_VAN_BAN, TRANG_THAI_HIEU_LUC } from '@/lib/constants';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [loaiVanBan, setLoaiVanBan] = useState(searchParams.get('loaiVanBan') ?? '');
  const [trangThai, setTrangThai] = useState(searchParams.get('trangThai') ?? '');
  const [tuNgay, setTuNgay] = useState(searchParams.get('tuNgay') ?? '');
  const [denNgay, setDenNgay] = useState(searchParams.get('denNgay') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') ?? 'moi_nhat');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (loaiVanBan) params.set('loaiVanBan', loaiVanBan);
    if (trangThai) params.set('trangThai', trangThai);
    if (tuNgay) params.set('tuNgay', tuNgay);
    if (denNgay) params.set('denNgay', denNgay);
    if (sortBy) params.set('sortBy', sortBy);
    params.set('page', '1');
    router.push(`/documents?${params.toString()}`);
  }, [search, loaiVanBan, trangThai, tuNgay, denNgay, sortBy, router]);

  const handleReset = () => {
    setSearch('');
    setLoaiVanBan('');
    setTrangThai('');
    setTuNgay('');
    setDenNgay('');
    setSortBy('moi_nhat');
    router.push('/documents');
  };

  const inputCls = "w-full border border-border-subtle rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy bg-white";

  return (
    <div className="bg-white border border-border-subtle rounded-lg p-4 mb-4 shadow-sm">
      {/* Tìm kiếm chính */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm theo số hiệu hoặc tên văn bản..."
          className="flex-1 border border-border-subtle rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy bg-white"
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-1.5 bg-primary-navy text-white px-4 py-2 rounded-md text-sm hover:bg-primary-navy-light transition-colors font-medium"
        >
          <Search size={15} />
          Tìm kiếm
        </button>
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`flex items-center gap-1 border px-3 py-2 rounded-md text-sm transition-colors ${
            showAdvanced
              ? 'bg-primary-navy text-white border-primary-navy'
              : 'border-border-subtle text-text-muted hover:bg-bg-page'
          }`}
          title="Tìm kiếm nâng cao"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Nâng cao</span>
        </button>
      </div>

      {/* Tìm kiếm nâng cao */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Loại văn bản</label>
            <select value={loaiVanBan} onChange={(e) => setLoaiVanBan(e.target.value)} className={inputCls}>
              <option value="">Tất cả loại</option>
              {LOAI_VAN_BAN.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Trạng thái</label>
            <select value={trangThai} onChange={(e) => setTrangThai(e.target.value)} className={inputCls}>
              <option value="">Tất cả trạng thái</option>
              {TRANG_THAI_HIEU_LUC.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Sắp xếp</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={inputCls}>
              <option value="moi_nhat">Mới nhất trước</option>
              <option value="cu_nhat">Cũ nhất trước</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Từ ngày</label>
            <input type="date" value={tuNgay} onChange={(e) => setTuNgay(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Đến ngày</label>
            <input type="date" value={denNgay} onChange={(e) => setDenNgay(e.target.value)} className={inputCls} />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full border border-border-subtle px-3 py-2 rounded-md text-sm hover:bg-bg-page transition-colors text-text-muted"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
