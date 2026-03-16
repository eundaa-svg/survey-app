import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin, department, grade } = await request.json();

    if (!nickname || !pin || !department || grade === undefined) {
      return NextResponse.json({ error: '필수 정보를 입력하세요' }, { status: 400 });
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
      { message: '회원가입 완료', userId: userData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다' }, { status: 500 });
  }
}
