// Middleware — đồng bộ Supabase session giữa client và server trên mọi request
// Bắt buộc phải có để Server Component đọc được session sau khi đăng nhập

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

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
          // Ghi cookie vào request để các handler tiếp theo đọc được
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Tạo lại response và ghi cookie vào response để browser lưu
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // QUAN TRỌNG: Gọi getUser() để refresh token nếu hết hạn.
  // Không dùng getSession() vì nó không verify token phía server.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Bỏ qua static files, chạy trên tất cả route còn lại
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
