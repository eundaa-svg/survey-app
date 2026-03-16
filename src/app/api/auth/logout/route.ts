import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clearUserCookie } from '@/lib/cookie-storage';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (sessionToken) {
      try {
        await prisma.session.deleteMany({
          where: { sessionToken },
        });
      } catch (error) {
        console.error('Database error during logout, continuing anyway:', error);
      }
    }

    let response = NextResponse.json({ message: '로그아웃 완료' }, { status: 200 });
    response = clearUserCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: '로그아웃 중 오류가 발생했습니다' }, { status: 500 });
  }
}
