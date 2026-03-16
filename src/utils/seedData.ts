export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  creator: {
    nickname: string;
    department: string;
  };
  currentResponses: number;
  maxResponses: number;
  estimatedMinutes: number;
  deadline: string;
  rewardType: string;
  rewardAmount?: number;
  rewardDescription?: string;
  status: string;
  creatorId: string;
}

export function initializeSeedData() {
  // 기존 데이터 확인
  if (localStorage.getItem('surveys')) {
    return;
  }

  // 기본 사용자 생성
  let users: any = {};
  try {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      users = JSON.parse(usersJson);
    }
  } catch (e) {
    users = {};
  }

  // 샘플 사용자 추가
  const sampleUsers = [
    {
      nickname: 'admin',
      pin: '1234',
      department: '컴퓨터공학과',
      grade: 3,
    },
    {
      nickname: 'user1',
      pin: '1111',
      department: '전자공학과',
      grade: 2,
    },
    {
      nickname: 'user2',
      pin: '2222',
      department: '기계공학과',
      grade: 4,
    },
  ];

  sampleUsers.forEach((sampleUser) => {
    const userId = `user_${Object.keys(users).length + 1}`;
    if (!Object.values(users).some((u: any) => u.nickname === sampleUser.nickname)) {
      users[userId] = {
        id: userId,
        nickname: sampleUser.nickname,
        pin: sampleUser.pin,
        department: sampleUser.department,
        grade: sampleUser.grade,
        points: Math.floor(Math.random() * 5000) + 1000,
        createdAt: new Date().toISOString(),
      };
    }
  });

  localStorage.setItem('users', JSON.stringify(users));

  // 시드 설문 데이터
  const now = new Date();
  const surveys: Survey[] = [
    {
      id: `survey_1`,
      title: '2024년 캠퍼스 생활만족도 조사',
      description: '우리 대학의 캠퍼스 시설, 학생 서비스, 커뮤니티에 대한 만족도를 조사하고 있습니다.',
      category: 'ACADEMIC',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      currentResponses: 45,
      maxResponses: 100,
      estimatedMinutes: 10,
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 500,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'admin') || 'user_1',
    },
    {
      id: `survey_2`,
      title: '대학생 온라인 쇼핑 이용행태 연구',
      description: 'MZ세대 대학생의 온라인 쇼핑 습관과 선호도에 관한 학술 연구입니다. 약 15분 소요됩니다.',
      category: 'RESEARCH',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'user1', department: '전자공학과' },
      currentResponses: 28,
      maxResponses: 80,
      estimatedMinutes: 15,
      deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 800,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'user1') || 'user_2',
    },
    {
      id: `survey_3`,
      title: '학생 식당 메뉴 개선안 설문',
      description: '학생식당 메뉴 만족도와 개선 사항에 대한 의견을 수렴합니다. 캠퍼스 시설 개선에 반영됩니다.',
      category: 'CAMPUS',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      currentResponses: 67,
      maxResponses: 150,
      estimatedMinutes: 5,
      deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 300,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'admin') || 'user_1',
    },
    {
      id: `survey_4`,
      title: '대학 도서관 이용 패턴 분석',
      description: '도서관 자료, 열람실, 스터디 공간 이용 현황을 파악하기 위한 학술 설문입니다.',
      category: 'ACADEMIC',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'user2', department: '기계공학과' },
      currentResponses: 52,
      maxResponses: 120,
      estimatedMinutes: 12,
      deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 600,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'user2') || 'user_3',
    },
    {
      id: `survey_5`,
      title: '스트리밍 서비스 이용 실태 조사',
      description: '대학생의 영상 스트리밍 서비스 이용 습관, 선호 장르, 비용 지출에 관한 설문입니다.',
      category: 'OTHER',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      currentResponses: 31,
      maxResponses: 100,
      estimatedMinutes: 8,
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 400,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'admin') || 'user_1',
    },
    {
      id: `survey_6`,
      title: '대학생 커리어 준비 현황 조사',
      description: '취업 준비, 인턴십, 자격증 취득, 해외경험 등 대학생의 커리어 계획에 관한 설문입니다.',
      category: 'RESEARCH',
      createdAt: new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString(),
      creator: { nickname: 'user1', department: '전자공학과' },
      currentResponses: 73,
      maxResponses: 120,
      estimatedMinutes: 12,
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      rewardType: 'POINT',
      rewardAmount: 700,
      status: 'ACTIVE',
      creatorId: Object.keys(users).find((k) => users[k].nickname === 'user1') || 'user_2',
    },
  ];

  localStorage.setItem('surveys', JSON.stringify(surveys));
}
