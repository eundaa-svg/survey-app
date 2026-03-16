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

    const transactions = await prisma.pointTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      balance: session.user.points,
      transactions,
    });
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json({ error: '포인트 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
