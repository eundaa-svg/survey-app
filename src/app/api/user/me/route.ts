import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

interface SessionUser {
  id: string;
  nickname?: string | null;
}

const updateProfileSchema = z.object({
  department: z.string().max(100).optional(),
  grade: z.number().int().min(1).max(6).optional().nullable(),
  interests: z.array(z.enum(['ACADEMIC', 'RESEARCH', 'CAMPUS', 'OTHER'])).optional(),
});

// GET /api/user/me
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      nickname: true,
      department: true,
      grade: true,
      points: true,
      interests: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : [],
  });
}

// PUT /api/user/me
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '입력값이 올바르지 않습니다', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { department, grade, interests } = parsed.data;

  const updateData: Record<string, unknown> = {};
  if (department !== undefined) updateData.department = department;
  if (grade !== undefined) updateData.grade = grade;
  if (interests !== undefined) updateData.interests = JSON.stringify(interests);

  const user = await prisma.user.update({
    where: { id: sessionUser.id },
    data: updateData,
    select: {
      id: true,
      nickname: true,
      department: true,
      grade: true,
      points: true,
      interests: true,
    },
  });

  return NextResponse.json({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : [],
  });
}

// DELETE /api/user/me
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.delete({
    where: { id: sessionUser.id },
  });

  return NextResponse.json({ message: 'Account deleted successfully' });
}
