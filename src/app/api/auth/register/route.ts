import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin, department, grade } = await request.json();

    if (!nickname || !pin || !department || grade === undefined) {
      return NextResponse.json({ error: '필수 정보를 입력하세요' }, { status: 400 });
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
        { error: '이미 등록된 닉네임입니다' },
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
      { message: '회원가입 완료', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
