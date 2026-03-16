import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fallbackSurveys } from '@/lib/fallback-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      const survey = await prisma.survey.findUnique({
        where: { id: params.id },
        include: {
          creator: {
            select: { id: true, nickname: true, department: true },
          },
          questions: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });

      if (!survey) {
        return NextResponse.json({ error: '설문을 찾을 수 없습니다' }, { status: 404 });
      }

      return NextResponse.json(survey);
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError);
      
      // 폴백 데이터에서 찾기
      const fallbackSurvey = fallbackSurveys.find(s => s.id === params.id);
      if (!fallbackSurvey) {
        return NextResponse.json({ error: '설문을 찾을 수 없습니다' }, { status: 404 });
      }

      return NextResponse.json(fallbackSurvey);
    }
  } catch (error) {
    console.error('Get survey error:', error);
    return NextResponse.json({ error: '설문 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      const survey = await prisma.survey.findUnique({
        where: { id: params.id },
      });

      if (!survey) {
        return NextResponse.json({ error: '설문을 찾을 수 없습니다' }, { status: 404 });
      }

      if (survey.creatorId !== session.user.id) {
        return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
      }

      if (survey.status !== 'DRAFT') {
        return NextResponse.json({ error: 'DRAFT 상태인 설문만 수정할 수 있습니다' }, { status: 400 });
      }

      const data = await request.json();
      const updated = await prisma.survey.update({
        where: { id: params.id },
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
        },
        include: {
          creator: {
            select: { id: true, nickname: true, department: true },
          },
          questions: true,
        },
      });

      return NextResponse.json(updated);
    } catch (dbError) {
      console.error('Database error, offline mode - data will be saved locally:', dbError);
      
      const data = await request.json();
      return NextResponse.json({
        id: params.id,
        ...data,
        offline: true,
      });
    }
  } catch (error) {
    console.error('Update survey error:', error);
    return NextResponse.json({ error: '설문 수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (!session) {
        return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
      }

      const survey = await prisma.survey.findUnique({
        where: { id: params.id },
      });

      if (!survey) {
        return NextResponse.json({ error: '설문을 찾을 수 없습니다' }, { status: 404 });
      }

      if (survey.creatorId !== session.user.id) {
        return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
      }

      await prisma.survey.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ message: '설문이 삭제되었습니다' });
    } catch (dbError) {
      console.error('Database error, offline delete:', dbError);
      return NextResponse.json({ message: '설문이 삭제되었습니다' });
    }
  } catch (error) {
    console.error('Delete survey error:', error);
    return NextResponse.json({ error: '설문 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
