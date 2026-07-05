// Middleware — đồng bộ session Supabase + bảo vệ toàn bộ app
// Logic: cho qua nếu đã đăng nhập HOẶC đang ở route được loại trừ.
// Ngược lại redirect ngay về /login trước khi bất kỳ trang nào được render.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Route KHÔNG cần đăng nhập (blacklist approach — mọi route còn lại đều được bảo vệ)
const PUBLIC_PATHS = [
  '/login',  // trang đăng nhập — bắt buộc phải loại trừ để tránh redirect loop
  '/api/',   // API routes — trả JSON, không thể redirect về HTML login
];

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() refresh token nếu hết hạn, verify phía server (an toàn hơn getSession)
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Chưa đăng nhập + không phải route public → redirect ngay về /login
  // Điều này xảy ra TRƯỚC KHI bất kỳ Server Component nào được render
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Chạy trên tất cả route, bỏ qua static assets
    // "/" khớp với pattern này và sẽ được middleware xử lý
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
