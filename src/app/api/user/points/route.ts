import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

// GET /api/user/points
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { points: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const transactions = await prisma.pointTransaction.findMany({
    where: { userId: sessionUser.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    balance: user.points,
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.type === 'EARN' ? t.amount : -t.amount,
      description: t.description,
      date: t.createdAt,
    })),
  });
}
