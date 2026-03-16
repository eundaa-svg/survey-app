import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value;
  return sessionToken;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'latest';
    const status = searchParams.get('status') || 'ACTIVE';

    const where: any = {
      status: status || 'ACTIVE',
      deadline: {
        gt: new Date(),
      },
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'deadline') {
      orderBy = { deadline: 'asc' };
    } else if (sort === 'reward') {
      orderBy = { rewardAmount: 'desc' };
    }

    const surveys = await prisma.survey.findMany({
      where,
      orderBy,
      include: {
        creator: {
          select: { id: true, nickname: true, department: true },
        },
        questions: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json(surveys);
  } catch (error) {
    console.error('Get surveys error:', error);
    return NextResponse.json({ error: '설문 목록 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionUser(request);
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

    const { title, description, category, deadline, estimatedMinutes, maxResponses, rewardType, rewardAmount, rewardDescription, questions, status } = await request.json();

    // 포인트 설문인 경우 포인트 차감 검증
    const totalRewardCost = rewardType === 'POINT' ? (rewardAmount || 0) * maxResponses : 0;
    if (totalRewardCost > session.user.points) {
      return NextResponse.json({ error: '포인트가 부족합니다' }, { status: 400 });
    }

    // 설문 생성
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
        category,
        deadline: new Date(deadline),
        estimatedMinutes,
        maxResponses,
        rewardType,
        rewardAmount,
        rewardDescription,
        status: status || 'DRAFT',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        questions: {
          create: questions.map((q: any, idx: number) => ({
            orderIndex: idx + 1,
            type: q.type,
            title: q.title,
            description: q.description,
            isRequired: q.isRequired,
            options: q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: {
        questions: true,
        creator: {
          select: { id: true, nickname: true, department: true },
        },
      },
    });

    // 포인트 차감 (ACTIVE 상태인 경우만)
    if (status === 'ACTIVE' && totalRewardCost > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { decrement: totalRewardCost } },
      });

      await prisma.pointTransaction.create({
        data: {
          userId: session.user.id,
          type: 'SPEND',
          amount: totalRewardCost,
          description: `설문 보상 예산: ${title}`,
          surveyId: survey.id,
        },
      });
    }

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error('Create survey error:', error);
    return NextResponse.json({ error: '설문 생성 중 오류가 발생했습니다' }, { status: 500 });
  }
}
