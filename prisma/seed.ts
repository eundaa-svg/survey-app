import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시드 시작...');

  // 기존 데이터 삭제
  await prisma.pointTransaction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.response.deleteMany();
  await prisma.question.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 샘플 사용자 생성
  const users = await Promise.all([
    prisma.user.create({
      data: {
        nickname: '학생회',
        pin: '1234',
        department: '학생회',
        grade: 3,
        role: 'STUDENT',
        points: 5000,
        interests: JSON.stringify(['ACADEMIC', 'RESEARCH']),
      },
    }),
    prisma.user.create({
      data: {
        nickname: '교수님',
        pin: '1234',
        department: '컴퓨터공학과',
        grade: 0,
        role: 'PROFESSOR',
        points: 10000,
        interests: JSON.stringify(['RESEARCH']),
      },
    }),
    prisma.user.create({
      data: {
        nickname: '연구원',
        pin: '1234',
        department: '경영학과',
        grade: 2,
        role: 'STUDENT',
        points: 1000,
        interests: JSON.stringify(['CAMPUS', 'ACADEMIC']),
      },
    }),
  ]);

  console.log(`✅ ${users.length}명의 사용자 생성됨`);

  // 샘플 설문 생성
  const surveys = await Promise.all([
    // 설문 1: 학생회가 생성
    prisma.survey.create({
      data: {
        title: '대학 캠퍼스 시설 만족도 조사',
        description: '우리 캠퍼스의 다양한 시설에 대한 의견을 수집하고 있습니다.',
        creatorId: users[0].id,
        status: 'ACTIVE',
        category: 'CAMPUS',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 100,
        currentResponses: 1,
        rewardType: 'POINT',
        rewardAmount: 500,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 5,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SINGLE_CHOICE',
              title: '도서관 만족도',
              isRequired: true,
              options: JSON.stringify(['매우 만족', '만족', '보통', '불만족', '매우 불만족']),
            },
            {
              orderIndex: 2,
              type: 'SINGLE_CHOICE',
              title: '식당 만족도',
              isRequired: true,
              options: JSON.stringify(['매우 만족', '만족', '보통', '불만족', '매우 불만족']),
            },
            {
              orderIndex: 3,
              type: 'SHORT_TEXT',
              title: '개선되었으면 하는 시설은?',
              isRequired: false,
            },
          ],
        },
      },
    }),

    // 설문 2: 교수가 생성
    prisma.survey.create({
      data: {
        title: '온라인 강의 플랫폼 개선 의견 수집',
        description: '현재 사용 중인 온라인 강의 플랫폼에 대한 피드백을 받습니다.',
        creatorId: users[1].id,
        status: 'ACTIVE',
        category: 'ACADEMIC',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 150,
        currentResponses: 0,
        rewardType: 'POINT',
        rewardAmount: 300,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 8,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SINGLE_CHOICE',
              title: '온라인 강의 플랫폼을 자주 이용하시나요?',
              isRequired: true,
              options: JSON.stringify(['자주 이용', '가끔 이용', '거의 이용하지 않음']),
            },
            {
              orderIndex: 2,
              type: 'MULTIPLE_CHOICE',
              title: '가장 불편한 기능은? (복수선택)',
              isRequired: true,
              options: JSON.stringify(['로그인', '강의 재생', '과제 제출', '커뮤니티', '기타']),
            },
            {
              orderIndex: 3,
              type: 'SCALE',
              title: '전반적인 만족도',
              isRequired: true,
            },
            {
              orderIndex: 4,
              type: 'LONG_TEXT',
              title: '개선 사항에 대해 자유롭게 의견을 주세요',
              isRequired: false,
            },
          ],
        },
      },
    }),

    // 설문 3: 연구원이 생성
    prisma.survey.create({
      data: {
        title: '대학생 일상생활 비용 조사',
        description: '한국 대학생들의 월평균 생활비 및 소비 패턴에 관한 조사입니다.',
        creatorId: users[2].id,
        status: 'ACTIVE',
        category: 'RESEARCH',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 50,
        currentResponses: 0,
        rewardType: 'POINT',
        rewardAmount: 1000,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 10,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SINGLE_CHOICE',
              title: '월평균 생활비는?',
              isRequired: true,
              options: JSON.stringify(['100만원 미만', '100-200만원', '200-300만원', '300만원 이상']),
            },
            {
              orderIndex: 2,
              type: 'MULTIPLE_CHOICE',
              title: '주요 소비 항목은? (복수선택)',
              isRequired: true,
              options: JSON.stringify(['식사', '교통', '통신', '취미', '의류', '기타']),
            },
            {
              orderIndex: 3,
              type: 'SHORT_TEXT',
              title: '용돈이 충분한가요?',
              isRequired: false,
            },
          ],
        },
      },
    }),

    // 설문 4: 학생회가 생성 (CLOSED)
    prisma.survey.create({
      data: {
        title: '도서관 운영 시간 개선 안내 설문',
        description: '도서관 운영 시간에 대한 학생들의 의견을 수렴합니다.',
        creatorId: users[0].id,
        status: 'CLOSED',
        category: 'CAMPUS',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 80,
        currentResponses: 1,
        rewardType: 'GIFTCARD',
        rewardDescription: '편의점 모바일 상품권',
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 3,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SINGLE_CHOICE',
              title: '선호하는 도서관 운영 시간은?',
              isRequired: true,
              options: JSON.stringify(['08:00 ~ 24:00', '08:00 ~ 23:00', '09:00 ~ 22:00', '기타']),
            },
            {
              orderIndex: 2,
              type: 'SINGLE_CHOICE',
              title: '주말 운영 필요성',
              isRequired: true,
              options: JSON.stringify(['필요', '불필요']),
            },
          ],
        },
      },
    }),

    // 설문 5: 교수가 생성
    prisma.survey.create({
      data: {
        title: '학생 만족도 조사 2024',
        description: '2024학년도 학생 만족도 조사입니다.',
        creatorId: users[1].id,
        status: 'ACTIVE',
        category: 'ACADEMIC',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 200,
        currentResponses: 0,
        rewardType: 'POINT',
        rewardAmount: 250,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 7,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SCALE',
              title: '강의 품질 만족도',
              isRequired: true,
            },
            {
              orderIndex: 2,
              type: 'SCALE',
              title: '교수님 설명의 명확성',
              isRequired: true,
            },
            {
              orderIndex: 3,
              type: 'LONG_TEXT',
              title: '개선되었으면 하는 사항',
              isRequired: false,
            },
          ],
        },
      },
    }),

    // 설문 6: 연구원이 생성
    prisma.survey.create({
      data: {
        title: '캠퍼스 안전 인식 조사',
        description: '캠퍼스 내 안전에 대한 학생들의 인식도 조사',
        creatorId: users[2].id,
        status: 'ACTIVE',
        category: 'CAMPUS',
        targetDepartments: JSON.stringify([]),
        targetGrades: JSON.stringify([]),
        maxResponses: 120,
        currentResponses: 0,
        rewardType: 'POINT',
        rewardAmount: 400,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedMinutes: 6,
        questions: {
          create: [
            {
              orderIndex: 1,
              type: 'SINGLE_CHOICE',
              title: '캠퍼스 안전 수준은?',
              isRequired: true,
              options: JSON.stringify(['매우 안전', '안전', '보통', '불안', '매우 불안']),
            },
            {
              orderIndex: 2,
              type: 'MULTIPLE_CHOICE',
              title: '개선이 필요한 안전 영역은? (복수선택)',
              isRequired: true,
              options: JSON.stringify(['CCTV', '조명', '보안요원', '비상호출', '기타']),
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ ${surveys.length}개의 설문 생성됨`);

  // 샘플 응답 생성 (질문 정보 다시 조회)
  const surveyWithQuestions0 = await prisma.survey.findUnique({
    where: { id: surveys[0].id },
    include: { questions: { orderBy: { orderIndex: 'asc' } } },
  });

  const surveyWithQuestions3 = await prisma.survey.findUnique({
    where: { id: surveys[3].id },
    include: { questions: { orderBy: { orderIndex: 'asc' } } },
  });

  if (surveyWithQuestions0?.questions) {
    const response1 = await prisma.response.create({
      data: {
        surveyId: surveys[0].id,
        respondentId: users[1].id,
        isCompleted: true,
        rewardClaimed: true,
        completedAt: new Date(),
        answers: {
          create: [
            {
              questionId: surveyWithQuestions0.questions[0].id,
              value: '만족',
            },
            {
              questionId: surveyWithQuestions0.questions[1].id,
              value: '매우 만족',
            },
            {
              questionId: surveyWithQuestions0.questions[2].id,
              value: '더 많은 열람실이 필요합니다',
            },
          ],
        },
      },
    });
  }

  if (surveyWithQuestions3?.questions) {
    const response2 = await prisma.response.create({
      data: {
        surveyId: surveys[3].id,
        respondentId: users[1].id,
        isCompleted: true,
        rewardClaimed: true,
        completedAt: new Date(),
        answers: {
          create: [
            {
              questionId: surveyWithQuestions3.questions[0].id,
              value: '08:00 ~ 24:00',
            },
            {
              questionId: surveyWithQuestions3.questions[1].id,
              value: '필요',
            },
          ],
        },
      },
    });
  }

  console.log(`✅ 응답 생성됨`);

  // 포인트 트랜잭션 기록
  await prisma.pointTransaction.create({
    data: {
      userId: users[1].id,
      type: 'EARN',
      amount: 500,
      description: '설문 응답 완료',
      surveyId: surveys[0].id,
    },
  });

  console.log('✨ 데이터베이스 시드 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
