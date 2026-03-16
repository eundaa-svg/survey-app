import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;

    if (!userCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const userData = JSON.parse(userCookie);
      // PIN은 반환하지 않음
      const { pin, ...userWithoutPin } = userData;
      return NextResponse.json({ user: userWithoutPin }, { status: 200 });
    } catch (parseError) {
      console.error('Failed to parse user cookie:', parseError);
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
