import { NextRequest, NextResponse } from 'next/server';

export interface CookieUser {
  id: string;
  nickname: string;
  department: string;
  grade: number;
  points: number;
}

export function getUserFromCookie(request: NextRequest): CookieUser | null {
  try {
    const userCookie = request.cookies.get('user')?.value;
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

export function setUserCookie(response: NextResponse, user: CookieUser): NextResponse {
  response.cookies.set('user', JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}

export function clearUserCookie(response: NextResponse): NextResponse {
  response.cookies.delete('user');
  response.cookies.delete('sessionToken');
  return response;
}

export function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get('sessionToken')?.value || null;
}

export function setSessionCookie(response: NextResponse, sessionToken: string): NextResponse {
  response.cookies.set('sessionToken', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
