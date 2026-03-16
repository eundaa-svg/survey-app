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

    // 쿠키 기반 인증이므로 서버에서 중복 체크 불가
    // 항상 "사용 가능" 반환
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
