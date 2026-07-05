'use client';
// Phần auth trong header navy — nút Đăng nhập/Đăng xuất, xử lý signOut phía client

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function HeaderAuth({ user }) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-white text-primary-navy px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-white/90 transition-colors"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/70 text-xs hidden sm:block truncate max-w-[140px]" title={user.email}>
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="border border-white/30 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/10 transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  );
}
