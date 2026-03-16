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

    const cookieStore = await cookies();

    // 기존 유저 목록 쿠키 읽기
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
    if (users.some((u) => u.nickname === nickname)) {
      return NextResponse.json(
        { message: '이미 사용 중인 닉네임입니다' },
        { status: 409 }
      );
    }

    // 새 유저 객체 생성
    const newUser = {
      id: crypto.randomUUID(),
      nickname,
      pin,
      department,
      grade: parseInt(grade),
      points: 1000,
      createdAt: new Date().toISOString(),
      role: 'STUDENT',
    };

    // users 배열에 추가
    users.push(newUser);

    // 쿠키에 저장
    cookieStore.set('users', JSON.stringify(users), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    // currentUser 쿠키에 현재 유저 정보 저장 (로그인 상태)
    const { pin: _, ...userWithoutPin } = newUser;
    cookieStore.set('currentUser', JSON.stringify(userWithoutPin), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json(
      {
        message: '회원가입이 완료되었습니다',
        user: { id: newUser.id, nickname: newUser.nickname },
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
