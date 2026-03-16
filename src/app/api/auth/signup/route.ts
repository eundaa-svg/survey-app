import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

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

    // 닉네임 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용 중인 닉네임입니다' },
        { status: 409 }
      );
    }

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        nickname,
        pin,
        department,
        grade,
        role: 'STUDENT',
      },
    });

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다', user: { id: user.id, nickname: user.nickname } },
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
