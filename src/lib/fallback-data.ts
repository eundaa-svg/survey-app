// Fallback survey data when database is unavailable
// Each survey has distinct values for createdAt, deadline, and rewardAmount to test sorting

const baseDate = new Date(2026, 2, 8); // March 8, 2026

export const fallbackSurveys = [
  {
    id: 'survey_1',
    title: '대학 캠퍼스 시설 만족도 조사',
    description: '우리 캠퍼스의 다양한 시설에 대한 의견을 수집하고 있습니다.',
    creatorId: 'user_1',
    creator: {
      id: 'user_1',
      nickname: '학생회',
      department: '학생회',
      grade: 3,
    },
    status: 'ACTIVE',
    category: 'CAMPUS',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 100,
    currentResponses: 1,
    rewardType: 'POINT',
    rewardAmount: 500,
    createdAt: new Date(2026, 2, 10).toISOString(), // March 10
    deadline: new Date(2026, 2, 21).toISOString(), // March 21
    estimatedMinutes: 5,
    questions: [
      {
        id: 'q1',
        orderIndex: 1,
        type: 'SINGLE_CHOICE',
        title: '도서관 만족도',
        isRequired: true,
        options: JSON.stringify(['매우 만족', '만족', '보통', '불만족', '매우 불만족']),
      },
      {
        id: 'q2',
        orderIndex: 2,
        type: 'SINGLE_CHOICE',
        title: '식당 만족도',
        isRequired: true,
        options: JSON.stringify(['매우 만족', '만족', '보통', '불만족', '매우 불만족']),
      },
    ],
  },
  {
    id: 'survey_2',
    title: '온라인 강의 플랫폼 개선 의견 수집',
    description: '현재 사용 중인 온라인 강의 플랫폼에 대한 피드백을 받습니다.',
    creatorId: 'user_2',
    creator: {
      id: 'user_2',
      nickname: '교수님',
      department: '컴퓨터공학과',
      grade: 0,
    },
    status: 'ACTIVE',
    category: 'ACADEMIC',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 150,
    currentResponses: 0,
    rewardType: 'POINT',
    rewardAmount: 300,
    createdAt: new Date(2026, 2, 14).toISOString(), // March 14
    deadline: new Date(2026, 2, 18).toISOString(), // March 18
    estimatedMinutes: 8,
    questions: [
      {
        id: 'q3',
        orderIndex: 1,
        type: 'SINGLE_CHOICE',
        title: '온라인 강의 플랫폼을 자주 이용하시나요?',
        isRequired: true,
        options: JSON.stringify(['자주 이용', '가끔 이용', '거의 이용하지 않음']),
      },
    ],
  },
  {
    id: 'survey_3',
    title: '대학생 일상생활 비용 조사',
    description: '한국 대학생들의 월평균 생활비 및 소비 패턴에 관한 조사입니다.',
    creatorId: 'user_3',
    creator: {
      id: 'user_3',
      nickname: '연구원',
      department: '경영학과',
      grade: 2,
    },
    status: 'ACTIVE',
    category: 'RESEARCH',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 50,
    currentResponses: 0,
    rewardType: 'POINT',
    rewardAmount: 1000,
    createdAt: new Date(2026, 2, 8).toISOString(), // March 8
    deadline: new Date(2026, 2, 30).toISOString(), // March 30
    estimatedMinutes: 10,
    questions: [
      {
        id: 'q4',
        orderIndex: 1,
        type: 'SINGLE_CHOICE',
        title: '월평균 생활비는?',
        isRequired: true,
        options: JSON.stringify(['100만원 미만', '100-200만원', '200-300만원', '300만원 이상']),
      },
    ],
  },
  {
    id: 'survey_4',
    title: '학생 만족도 조사 2026',
    description: '2026학년도 학생 만족도 조사입니다.',
    creatorId: 'user_1',
    creator: {
      id: 'user_1',
      nickname: '학생회',
      department: '학생회',
      grade: 3,
    },
    status: 'ACTIVE',
    category: 'CAMPUS',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 200,
    currentResponses: 0,
    rewardType: 'POINT',
    rewardAmount: 200,
    createdAt: new Date(2026, 2, 15).toISOString(), // March 15
    deadline: new Date(2026, 2, 20).toISOString(), // March 20
    estimatedMinutes: 7,
    questions: [
      {
        id: 'q5',
        orderIndex: 1,
        type: 'SCALE',
        title: '강의 품질 만족도',
        isRequired: true,
      },
    ],
  },
  {
    id: 'survey_5',
    title: '캠퍼스 안전 인식 조사',
    description: '캠퍼스 내 안전에 대한 학생들의 인식도 조사',
    creatorId: 'user_2',
    creator: {
      id: 'user_2',
      nickname: '교수님',
      department: '컴퓨터공학과',
      grade: 0,
    },
    status: 'ACTIVE',
    category: 'CAMPUS',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 120,
    currentResponses: 0,
    rewardType: 'POINT',
    rewardAmount: 800,
    createdAt: new Date(2026, 2, 12).toISOString(), // March 12
    deadline: new Date(2026, 2, 25).toISOString(), // March 25
    estimatedMinutes: 6,
    questions: [
      {
        id: 'q6',
        orderIndex: 1,
        type: 'SINGLE_CHOICE',
        title: '캠퍼스 안전 수준은?',
        isRequired: true,
        options: JSON.stringify(['매우 안전', '안전', '보통', '불안', '매우 불안']),
      },
    ],
  },
  {
    id: 'survey_6',
    title: '도서관 운영 시간 개선 설문',
    description: '도서관 운영 시간에 대한 학생들의 의견을 수렴합니다.',
    creatorId: 'user_3',
    creator: {
      id: 'user_3',
      nickname: '연구원',
      department: '경영학과',
      grade: 2,
    },
    status: 'ACTIVE',
    category: 'CAMPUS',
    targetDepartments: [],
    targetGrades: [],
    maxResponses: 80,
    currentResponses: 0,
    rewardType: 'POINT',
    rewardAmount: 600,
    createdAt: new Date(2026, 2, 11).toISOString(), // March 11
    deadline: new Date(2026, 2, 22).toISOString(), // March 22
    estimatedMinutes: 3,
    questions: [
      {
        id: 'q7',
        orderIndex: 1,
        type: 'SINGLE_CHOICE',
        title: '선호하는 도서관 운영 시간은?',
        isRequired: true,
        options: JSON.stringify(['08:00 ~ 24:00', '08:00 ~ 23:00', '09:00 ~ 22:00', '기타']),
      },
    ],
  },
];
