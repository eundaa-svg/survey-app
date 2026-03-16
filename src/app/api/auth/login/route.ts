import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryDB } from '@/lib/memory-db';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin } = await request.json();

    if (!nickname || !pin) {
      return NextResponse.json({ error: '닉네임과 PIN을 입력하세요' }, { status: 400 });
    }

    let user: any;
    let sessionResult: any;

    try {
      // 유저 찾기
      user = await prisma.user.findUnique({
        where: { nickname },
      });

      if (!user || user.pin !== pin) {
        return NextResponse.json({ error: '닉네임 또는 PIN이 잘못되었습니다' }, { status: 401 });
      }

      // 세션 토큰 생성
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // 기존 세션 삭제
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // 새 세션 생성
      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires,
        },
      });

      sessionResult = { sessionToken, expires };
    } catch (dbError) {
      console.error('Database error, falling back to memory DB:', dbError);

      // 메모리 DB에서 유저 찾기
      user = memoryDB.findUserByNickname(nickname);

      if (!user || user.pin !== pin) {
        return NextResponse.json({ error: '닉네임 또는 PIN이 잘못되었습니다' }, { status: 401 });
      }

      // 메모리 DB에서 세션 생성
      sessionResult = memoryDB.createSession(user.id);
    }

    const response = NextResponse.json(
      { message: '로그인 성공', userId: user.id },
      { status: 200 }
    );
    response.cookies.set('sessionToken', sessionResult.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다' }, { status: 500 });
  }
}
