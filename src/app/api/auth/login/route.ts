import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin } = await request.json();

    if (!nickname || !pin) {
      return NextResponse.json({ error: '닉네임과 PIN을 입력하세요' }, { status: 400 });
    }

    // 쿠키에서 저장된 유저 정보 읽기
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;

    if (!userCookie) {
      return NextResponse.json(
        { error: '등록되지 않은 계정입니다' },
        { status: 401 }
      );
    }

    try {
      const userData = JSON.parse(userCookie);

      // 닉네임과 PIN 확인
      if (userData.nickname !== nickname || userData.pin !== pin) {
        return NextResponse.json(
          { error: '닉네임 또는 PIN이 잘못되었습니다' },
          { status: 401 }
        );
      }

      // 새 세션 토큰 생성
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      cookieStore.set('sessionToken', sessionToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30일
        path: '/',
      });

      return NextResponse.json(
        { message: '로그인 성공', userId: userData.id },
        { status: 200 }
      );
    } catch (parseError) {
      console.error('Failed to parse user cookie:', parseError);
      return NextResponse.json(
        { error: '로그인 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다' }, { status: 500 });
  }
}
