import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { pin, ...userWithoutPin } = session.user;

    return NextResponse.json(userWithoutPin);
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

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { nickname, department, grade, interests } = await request.json();

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
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '프로필 업데이트 중 오류가 발생했습니다' }, { status: 500 });
  }
}
