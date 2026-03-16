import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromCookie } from '@/lib/cookie-storage';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session || new Date() > session.expires) {
        return NextResponse.json({ error: '세션이 만료되었습니다' }, { status: 401 });
      }

      const { pin, ...userWithoutPin } = session.user;

      return NextResponse.json({ user: userWithoutPin });
    } catch (dbError) {
      console.error('Database error, falling back to cookie storage:', dbError);

      // 쿠키에서 사용자 정보 가져오기
      const user = getUserFromCookie(request);
      if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      return NextResponse.json({ user });
    }
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: '사용자 정보 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
