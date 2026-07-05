// Các hàm thao tác bảng "favorites" — dùng Supabase client phía browser

import { createClient } from './supabase/client';

function getClient() {
  return createClient();
}

/**
 * Lấy danh sách văn bản yêu thích của user, kèm thông tin document
 */
export async function getFavorites(supabase, userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, document_id, documents(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  // Chuyển về dạng mảng document thẳng để DocumentTable dùng được
  return (data ?? []).map((f) => ({ ...f.documents, favorite_id: f.id }));
}

/**
 * Thêm văn bản vào danh sách yêu thích
 */
export async function addFavorite(userId, documentId) {
  const supabase = getClient();
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, document_id: documentId });

  if (error) throw error;
}

/**
 * Xóa văn bản khỏi danh sách yêu thích
 */
export async function removeFavorite(userId, documentId) {
  const supabase = getClient();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('document_id', documentId);

  if (error) throw error;
}

/**
 * Kiểm tra user đã yêu thích văn bản chưa
 */
export async function isFavorited(userId, documentId) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('document_id', documentId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
