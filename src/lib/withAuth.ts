import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: string;
  department: string | null;
  hasCompletedSetup: boolean;
}

export async function withAuth(
  handler: (user: SessionUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return handler(user);
}
