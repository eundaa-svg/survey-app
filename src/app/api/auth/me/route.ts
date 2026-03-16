import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const currentUserCookie = cookieStore.get('currentUser')?.value;

    if (!currentUserCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const user = JSON.parse(currentUserCookie);
      return NextResponse.json({ user }, { status: 200 });
    } catch (e) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
