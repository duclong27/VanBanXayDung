// Các hàm truy vấn bảng "documents" — nhận supabase client làm tham số đầu tiên

import { PAGE_SIZE } from './constants';

/**
 * Lấy danh sách văn bản có filter, phân trang.
 * Trả về { data, count }
 */
export async function getDocuments(supabase, {
  search = '',
  loaiVanBan = '',
  coQuanBanHanh = '',
  trangThai = '',
  tuNgay = '',
  denNgay = '',
  sortBy = 'moi_nhat',
  page = 1,
  pageSize = PAGE_SIZE,
} = {}) {
  let query = supabase
    .from('documents')
    .select('*', { count: 'exact' });

  // Tìm kiếm theo số hiệu hoặc tên văn bản
  if (search) {
    query = query.or(`so_hieu.ilike.%${search}%,ten_van_ban.ilike.%${search}%`);
  }

  if (loaiVanBan) {
    query = query.eq('loai_van_ban', loaiVanBan);
  }

  if (coQuanBanHanh) {
    query = query.ilike('co_quan_ban_hanh', `%${coQuanBanHanh}%`);
  }

  if (trangThai) {
    query = query.eq('trang_thai', trangThai);
  }

  if (tuNgay) {
    query = query.gte('ngay_ban_hanh', tuNgay);
  }

  if (denNgay) {
    query = query.lte('ngay_ban_hanh', denNgay);
  }

  // Sắp xếp
  const ascending = sortBy === 'cu_nhat';
  query = query.order('ngay_ban_hanh', { ascending });

  // Phân trang
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

/**
 * Lấy chi tiết 1 văn bản theo id
 */
export async function getDocumentById(supabase, id) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

/**
 * Lấy danh sách văn bản mới nhất theo ngày ban hành
 */
export async function getRecentDocuments(supabase, limit = 5) {
  const { data, error } = await supabase
    .from('documents')
    .select('id, so_hieu, ten_van_ban, ngay_ban_hanh')
    .order('ngay_ban_hanh', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

/**
 * Thống kê tổng số, số còn hiệu lực, số hết hiệu lực
 */
export async function getStats(supabase) {
  const [total, conHieuLuc, hetHieuLuc] = await Promise.all([
    supabase.from('documents').select('', { count: 'exact', head: true }),
    supabase.from('documents').select('', { count: 'exact', head: true }).eq('trang_thai', 'Còn hiệu lực'),
    supabase.from('documents').select('', { count: 'exact', head: true }).eq('trang_thai', 'Hết hiệu lực'),
  ]);

  return {
    total: total.count ?? 0,
    conHieuLuc: conHieuLuc.count ?? 0,
    hetHieuLuc: hetHieuLuc.count ?? 0,
  };
}
