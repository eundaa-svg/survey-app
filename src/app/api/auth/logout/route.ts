import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    }

    const response = NextResponse.json({ message: '로그아웃 완료' }, { status: 200 });
    response.cookies.delete('sessionToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: '로그아웃 중 오류가 발생했습니다' }, { status: 500 });
  }
}
