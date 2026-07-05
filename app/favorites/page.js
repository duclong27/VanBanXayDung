// Trang yêu thích — Server Component, yêu cầu đăng nhập

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getFavorites } from '@/lib/favorites';
import DocumentTable from '@/components/DocumentTable';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'Văn bản yêu thích | Pháp lý Xây dựng',
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let documents = [];
  let error = null;

  try {
    documents = await getFavorites(supabase, user.id);
  } catch (err) {
    error = 'Không thể tải danh sách yêu thích. Vui lòng thử lại.';
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={20} className="text-red-500" fill="currentColor" />
        <h1 className="text-xl font-semibold text-gray-900">Văn bản yêu thích</h1>
        <span className="text-sm text-gray-400">({documents.length})</span>
      </div>

      {error ? (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
      ) : (
        <DocumentTable documents={documents} userId={user.id} />
      )}
    </div>
  );
}
