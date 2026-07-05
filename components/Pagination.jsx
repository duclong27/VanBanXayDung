'use client';
// Phân trang — đổi trang qua URL query param ?page=

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/documents?${params.toString()}`);
  }

  // Hiển thị tối đa 5 số trang xung quanh trang hiện tại
  const pages = [];
  const delta = 2;
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (end < totalPages) pages.push(totalPages);

  const btnBase = 'px-3 py-1.5 rounded-md text-sm border transition-colors';
  const btnActive = 'bg-blue-600 text-white border-blue-600 font-semibold';
  const btnNormal = 'border-gray-300 text-gray-700 hover:bg-gray-50';
  const btnDisabled = 'border-gray-200 text-gray-300 cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} ${currentPage <= 1 ? btnDisabled : btnNormal} flex items-center gap-1`}
      >
        <ChevronLeft size={14} />
        Trước
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnNormal}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} ${currentPage >= totalPages ? btnDisabled : btnNormal} flex items-center gap-1`}
      >
        Sau
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
