'use client';
// Trang đăng nhập / đăng xuất — dùng Supabase Auth

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  // Lazy-init: chỉ tạo client phía browser để tránh lỗi SSR khi chưa có env vars
  const supabaseRef = useRef(null);
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setChecking(false);
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      setLoading(false);
    } else {
      // Dùng hard navigation thay vì router.push() để tránh race condition với router cache.
      // signInWithPassword() đã set cookie xong trước khi resolve → server nhận
      // fresh request, middleware chạy getUser(), layout đọc đúng session mới.
      window.location.href = '/documents';
    }
  }

  async function handleLogout() {
    await getSupabase().auth.signOut();
    setUser(null);
    router.refresh();
  }

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-gray-400 text-sm">Đang kiểm tra...</span>
      </div>
    );
  }

  // Đã đăng nhập
  if (user) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-700 mb-1 text-sm">Đã đăng nhập với</p>
        <p className="font-semibold text-gray-900 mb-6">{user.email}</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Đăng xuất
        </button>
        <button
          onClick={() => router.push('/documents')}
          className="mt-3 w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          Về trang văn bản
        </button>
      </div>
    );
  }

  // Chưa đăng nhập
  return (
    <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-xl p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary-navy border-2 border-accent-amber rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-accent-amber font-bold text-lg font-mono">XD</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Đăng nhập</h1>
        <p className="text-sm text-gray-500 mt-1">Văn bản pháp lý ngành xây dựng</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-navy text-white py-2 rounded-md hover:bg-primary-navy-light transition-colors text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
