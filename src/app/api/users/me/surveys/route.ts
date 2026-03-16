import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromCookie } from '@/lib/cookie-storage';

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

      const surveys = await prisma.survey.findMany({
        where: { creatorId: session.user.id },
        include: {
          creator: {
            select: { id: true, nickname: true, department: true },
          },
          questions: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(surveys);
    } catch (dbError) {
      console.error('Database error, falling back to empty list:', dbError);

      const user = getUserFromCookie(request);
      if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Get my surveys error:', error);
    return NextResponse.json({ error: '내 설문 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
