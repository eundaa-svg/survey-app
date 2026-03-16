import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromCookie, setUserCookie } from '@/lib/cookie-storage';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      const { pin, ...userWithoutPin } = session.user;

      return NextResponse.json(userWithoutPin);
    } catch (dbError) {
      console.error('Database error, falling back to cookie storage:', dbError);

      const user = getUserFromCookie(request);
      if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      return NextResponse.json(user);
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: '프로필 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { nickname, department, grade, interests } = await request.json();

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          nickname: nickname || session.user.nickname,
          department: department || session.user.department,
          grade: grade !== undefined ? parseInt(grade) : session.user.grade,
          interests: interests ? JSON.stringify(interests) : session.user.interests,
        },
      });

      const { pin, ...userWithoutPin } = updated;

      return NextResponse.json(userWithoutPin);
    } catch (dbError) {
      console.error('Database error, updating cookie storage:', dbError);

      const user = getUserFromCookie(request);
      if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      const updatedUser = {
        ...user,
        nickname: nickname || user.nickname,
        department: department || user.department,
        grade: grade !== undefined ? parseInt(grade) : user.grade,
      };

      let response = NextResponse.json(updatedUser);
      response = setUserCookie(response, updatedUser);

      return response;
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '프로필 업데이트 중 오류가 발생했습니다' }, { status: 500 });
  }
}
