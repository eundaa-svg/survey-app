import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

// GET /api/user/surveys
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') ?? 'all';

  const where: Record<string, unknown> = {
    creatorId: sessionUser.id,
  };

  if (status !== 'all') {
    where.status = status.toUpperCase();
  }

  const surveys = await prisma.survey.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      currentResponses: true,
      maxResponses: true,
      deadline: true,
      createdAt: true,
      _count: {
        select: { questions: true },
      },
    },
  });

  return NextResponse.json({
    surveys: surveys.map((s) => ({
      ...s,
      questionCount: s._count.questions,
      _count: undefined,
    })),
  });
}
