import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value ||
                request.cookies.get('__Secure-next-auth.session-token')?.value;

  // 보호된 경로
  const protectedPaths = [
    '/survey/create',
    '/mypage',
    '/admin',
    '/survey/results',
  ];

  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // 보호된 경로이고 토큰이 없으면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/survey/create/:path*',
    '/mypage/:path*',
    '/admin/:path*',
    '/survey/results/:path*',
  ],
};
