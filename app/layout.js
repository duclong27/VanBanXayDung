// Layout gốc — async Server Component, đọc session Supabase, áp dụng blueprint style
// force-dynamic: đảm bảo layout không bao giờ bị cache tĩnh, luôn đọc session mới nhất

export const dynamic = 'force-dynamic';

import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import HeaderAuth from '@/components/HeaderAuth';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Font chính cho toàn bộ UI
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-sans',
  display: 'swap',
});

// Font mono — chỉ dùng cho số hiệu văn bản
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Tra cứu văn bản pháp lý ngành xây dựng',
  description: 'Hệ thống tra cứu văn bản pháp lý, quy chuẩn, tiêu chuẩn ngành xây dựng Việt Nam',
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="vi" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg-page font-sans antialiased">

        {/* Header — nền navy */}
        <header className="bg-primary-navy sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

            {/* Logo */}
            <Link href="/documents" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md border-2 border-accent-amber flex items-center justify-center flex-shrink-0">
                <span className="text-accent-amber text-xs font-bold font-mono">XD</span>
              </div>
              <div>
                <span className="font-semibold text-white text-sm leading-tight block">
                  Văn bản pháp lý Xây dựng
                </span>
                <span className="text-xs text-white/50 leading-tight block">
                  Tra cứu nhanh — Cập nhật liên tục
                </span>
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/documents" className="text-white/75 hover:text-white transition-colors">
                Văn bản
              </Link>
              <Link href="/favorites" className="text-white/75 hover:text-white transition-colors">
                Yêu thích
              </Link>
              <HeaderAuth user={user} />
            </nav>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border-subtle text-center py-4 text-xs text-text-muted">
          © {new Date().getFullYear()} Tra cứu văn bản pháp lý ngành xây dựng. Dữ liệu mang tính tham khảo.
        </footer>

        <ChatWidget />
      </body>
    </html>
  );
}
