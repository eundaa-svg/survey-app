import { prisma } from '@/lib/db';
import { memoryDB } from '@/lib/memory-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname) {
      return NextResponse.json(
        { message: '닉네임을 입력해주세요' },
        { status: 400 }
      );
    }

    if (nickname.length < 2 || nickname.length > 10) {
      return NextResponse.json(
        { message: '닉네임은 2~10자여야 합니다' },
        { status: 400 }
      );
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { nickname },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: '이미 사용 중인 닉네임입니다', available: false },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error('Database error, falling back to memory DB:', dbError);

      // 메모리 DB에서 확인
      const existingUser = memoryDB.findUserByNickname(nickname);
      if (existingUser) {
        return NextResponse.json(
          { message: '이미 사용 중인 닉네임입니다', available: false },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: '사용 가능한 닉네임입니다', available: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check nickname error:', error);
    return NextResponse.json(
      { message: '닉네임 확인 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
