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

    const responses = await prisma.response.findMany({
      where: { respondentId: session.user.id },
      include: {
        survey: {
          include: {
            creator: {
              select: { id: true, nickname: true, department: true },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Get participations error:', error);
    return NextResponse.json({ error: '참여 내역 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
