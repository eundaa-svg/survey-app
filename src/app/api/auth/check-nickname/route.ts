import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    // 같은 닉네임이 있는지 확인
    const exists = users.some((u) => u.nickname === nickname);

    if (exists) {
      return NextResponse.json(
        { message: '이미 사용 중인 닉네임입니다', available: false },
        { status: 400 }
      );
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
