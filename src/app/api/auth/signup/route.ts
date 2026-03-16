import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin, department, grade } = await request.json();

    // 유효성 검사
    if (!nickname || !pin || !department || !grade) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요' },
        { status: 400 }
      );
    }

    if (nickname.length < 2 || nickname.length > 10) {
      return NextResponse.json(
        { message: '닉네임은 2~10자여야 합니다' },
        { status: 400 }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { message: '비밀번호는 4자리 숫자여야 합니다' },
        { status: 400 }
      );
    }

    // 유저 데이터 생성 (쿠키에 저장)
    const userData = {
      id: crypto.randomUUID(),
      nickname,
      pin,
      department,
      grade: parseInt(grade),
      points: 1000,
      createdAt: new Date().toISOString(),
      role: 'STUDENT',
    };

    // 쿠키에 유저 정보 저장
    const cookieStore = await cookies();
    cookieStore.set('user', JSON.stringify(userData), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: '/',
    });

    // 세션 토큰도 쿠키에 저장
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    cookieStore.set('sessionToken', sessionToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json(
      {
        message: '회원가입이 완료되었습니다',
        user: { id: userData.id, nickname: userData.nickname },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
