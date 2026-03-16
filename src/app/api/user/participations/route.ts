import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

// GET /api/user/participations
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const responses = await prisma.response.findMany({
    where: {
      respondentId: sessionUser.id,
      isCompleted: true,
    },
    orderBy: { completedAt: 'desc' },
    select: {
      id: true,
      survey: {
        select: {
          id: true,
          title: true,
          rewardType: true,
          rewardAmount: true,
        },
      },
      completedAt: true,
      rewardClaimed: true,
    },
  });

  return NextResponse.json({
    participations: responses.map((r) => ({
      id: r.id,
      surveyId: r.survey.id,
      surveyTitle: r.survey.title,
      participatedAt: r.completedAt,
      rewardStatus: r.rewardClaimed ? '지급완료' : '추첨대기',
      rewardType: r.survey.rewardType.toLowerCase(),
      rewardAmount: r.survey.rewardAmount,
    })),
  });
}
