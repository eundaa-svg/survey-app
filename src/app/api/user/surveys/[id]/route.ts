import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface RouteParams {
  params: {
    id: string;
  };
}

const closeSurveySchema = z.object({
  action: z.literal('close'),
});

// PATCH /api/user/surveys/[id]
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Check survey ownership
  const survey = await prisma.survey.findUnique({
    where: { id },
    select: { creatorId: true, status: true },
  });

  if (!survey) {
    return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
  }

  if (survey.creatorId !== sessionUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = closeSurveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '잘못된 요청입니다', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updated = await prisma.survey.update({
    where: { id },
    data: { status: 'CLOSED' },
    select: { id: true, status: true },
  });

  return NextResponse.json({ message: '설문이 마감되었습니다', survey: updated });
}

// DELETE /api/user/surveys/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Check survey ownership
  const survey = await prisma.survey.findUnique({
    where: { id },
    select: { creatorId: true, status: true },
  });

  if (!survey) {
    return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
  }

  if (survey.creatorId !== sessionUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Only allow deletion of draft/closed surveys
  if (survey.status !== 'DRAFT' && survey.status !== 'CLOSED') {
    return NextResponse.json(
      { error: '진행 중인 설문은 삭제할 수 없습니다' },
      { status: 400 }
    );
  }

  await prisma.survey.delete({
    where: { id },
  });

  return NextResponse.json({ message: '설문이 삭제되었습니다' });
}
