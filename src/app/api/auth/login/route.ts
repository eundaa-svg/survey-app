import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin } = await request.json();

    if (!nickname || !pin) {
      return NextResponse.json({ error: '닉네임과 PIN을 입력하세요' }, { status: 400 });
    }

    const cookieStore = await cookies();

    // users 쿠키에서 유저 목록 읽기
    let users: any[] = [];
    const usersCookie = cookieStore.get('users')?.value;
    if (usersCookie) {
      try {
        users = JSON.parse(usersCookie);
      } catch (e) {
        users = [];
      }
    }

    // nickname과 pin이 일치하는 유저 찾기
    const user = users.find((u) => u.nickname === nickname && u.pin === pin);

    if (!user) {
      return NextResponse.json(
        { error: '닉네임 또는 PIN이 일치하지 않습니다' },
        { status: 401 }
      );
    }

    // currentUser 쿠키에 유저 정보 저장
    const { pin: _, ...userWithoutPin } = user;
    cookieStore.set('currentUser', JSON.stringify(userWithoutPin), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json(
      { message: '로그인 성공', userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
