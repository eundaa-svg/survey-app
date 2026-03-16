import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fallbackSurveys } from '@/lib/fallback-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { answers } = await request.json();

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

      // 설문 상태 확인
      if (survey.status !== 'ACTIVE') {
        return NextResponse.json({ error: '응답할 수 없는 설문입니다' }, { status: 400 });
      }

      // 마감일 확인
      if (new Date() > survey.deadline) {
        return NextResponse.json({ error: '마감된 설문입니다' }, { status: 400 });
      }

      // 중복 응답 확인
      const existingResponse = await prisma.response.findUnique({
        where: {
          surveyId_respondentId: {
            surveyId: params.id,
            respondentId: session.user.id,
          },
        },
      });

      if (existingResponse) {
        return NextResponse.json({ error: '이미 이 설문에 응답하셨습니다' }, { status: 400 });
      }

      // 응답 생성
      const response = await prisma.response.create({
        data: {
          surveyId: params.id,
          respondentId: session.user.id,
          isCompleted: true,
          completedAt: new Date(),
          answers: {
            create: answers.map((a: any) => ({
              questionId: a.questionId,
              value: a.value,
              selectedOptions: a.selectedOptions ? JSON.stringify(a.selectedOptions) : null,
            })),
          },
        },
        include: {
          answers: true,
        },
      });

      // currentResponses 증가
      const updatedSurvey = await prisma.survey.update({
        where: { id: params.id },
        data: { currentResponses: { increment: 1 } },
      });

      // 포인트 보상 처리
      if (survey.rewardType === 'POINT' && survey.rewardAmount) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { points: { increment: survey.rewardAmount } },
        });

        await prisma.pointTransaction.create({
          data: {
            userId: session.user.id,
            type: 'EARN',
            amount: survey.rewardAmount,
            description: `설문 응답 완료: ${survey.title}`,
            surveyId: params.id,
          },
        });

        // 응답 보상 처리 완료 표시
        await prisma.response.update({
          where: { id: response.id },
          data: { rewardClaimed: true },
        });
      }

      // 응답 목표 도달 시 상태 변경
      if (updatedSurvey.currentResponses >= updatedSurvey.maxResponses) {
        await prisma.survey.update({
          where: { id: params.id },
          data: { status: 'COMPLETED' },
        });
      }

      return NextResponse.json(response, { status: 201 });
    } catch (dbError) {
      console.error('Database error, offline response mode:', dbError);

      // 오프라인 모드: 응답을 로컬에 저장하도록 지시
      const tempResponseId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const tempResponse = {
        id: tempResponseId,
        surveyId: params.id,
        respondentId: 'local',
        isCompleted: true,
        completedAt: new Date().toISOString(),
        rewardClaimed: false,
        answers: answers.map((a: any, idx: number) => ({
          id: `a_${idx}`,
          ...a,
        })),
        offline: true,
      };

      return NextResponse.json(tempResponse, { status: 201 });
    }
  } catch (error) {
    console.error('Submit response error:', error);
    return NextResponse.json({ error: '응답 제출 중 오류가 발생했습니다' }, { status: 500 });
  }
}
