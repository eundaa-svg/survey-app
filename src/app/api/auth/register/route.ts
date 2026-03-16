import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryDB } from '@/lib/memory-db';
import { setUserCookie, setSessionCookie } from '@/lib/cookie-storage';

export async function POST(request: NextRequest) {
  try {
    const { nickname, pin, department, grade } = await request.json();

    if (!nickname || !pin || !department || grade === undefined) {
      return NextResponse.json({ error: '필수 정보를 입력하세요' }, { status: 400 });
    }

    let user: any;
    let sessionToken: string;

    try {
      // 닉네임 중복 확인
      const existing = await prisma.user.findUnique({
        where: { nickname },
      });

      if (existing) {
        return NextResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 400 });
      }

      // 유저 생성
      user = await prisma.user.create({
        data: {
          nickname,
          pin,
          department,
          grade: parseInt(grade),
          points: 1000,
          interests: JSON.stringify([]),
        },
      });

      // 세션 토큰 생성
      sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (dbError) {
      console.error('Database error, falling back to cookie storage:', dbError);

      // 쿠키 기반 중복 확인 (간단하게 처리)
      // 실제로는 모든 등록한 사용자를 확인해야 하지만, 여기서는 메모리DB 사용
      const existing = memoryDB.findUserByNickname(nickname);
      if (existing) {
        return NextResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 400 });
      }

      // 메모리 DB에 유저 생성
      user = memoryDB.createUser(nickname, pin, department, parseInt(grade));
      const sessionResult = memoryDB.createSession(user.id);
      sessionToken = sessionResult.sessionToken;
    }

    // 응답에 쿠키 설정
    let response = NextResponse.json(
      { message: '회원가입 완료', userId: user.id },
      { status: 201 }
    );

    // 사용자 정보를 쿠키에 저장 (폴백용)
    response = setUserCookie(response, {
      id: user.id,
      nickname: user.nickname,
      department: user.department,
      grade: user.grade,
      points: user.points,
    });

    // 세션 토큰 설정
    response = setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다' }, { status: 500 });
  }
}
