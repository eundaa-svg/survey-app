import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin, department, grade } = await request.json();

    if (!nickname || !pin || !department || grade === undefined) {
      return NextResponse.json({ error: '필수 정보를 입력하세요' }, { status: 400 });
    }

    // 닉네임 중복 확인
    const existing = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existing) {
      return NextResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 400 });
    }

    // 유저 생성
    const user = await prisma.user.create({
      data: {
        nickname,
        pin,
        department,
        grade: parseInt(grade),
        points: 1000, // 초기 포인트
        interests: JSON.stringify([]),
      },
    });

    // 세션 토큰 생성
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    // 응답에 쿠키 설정
    const response = NextResponse.json(
      { message: '회원가입 완료', userId: user.id },
      { status: 201 }
    );
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다' }, { status: 500 });
  }
}
