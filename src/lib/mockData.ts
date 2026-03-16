export interface MockSurvey {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'research' | 'campus' | 'other';
  creator: {
    name: string;
    department: string;
    avatar?: string;
  };
  reward: {
    type: 'point' | 'giftcard';
    value: number | string;
  };
  estimatedMinutes: number;
  currentResponses: number;
  maxResponses: number;
  deadline: Date;
  isCompleted?: boolean;
  isClosed?: boolean;
}

export const mockSurveys: MockSurvey[] = [
  {
    id: 'survey-1',
    title: 'MZ세대의 소비패턴 분석 설문',
    description: '대학생의 온라인 쇼핑 습관과 선호도에 대한 조사입니다.',
    category: 'research',
    creator: {
      name: '홍길동',
      department: '경영학과',
    },
    reward: {
      type: 'point',
      value: 500,
    },
    estimatedMinutes: 8,
    currentResponses: 24,
    maxResponses: 50,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
  },
  {
    id: 'survey-2',
    title: '캠퍼스 카페 메뉴 개선 의견 조사',
    description: '학생식당과 카페의 새로운 메뉴 추가에 대한 선호도 조사',
    category: 'campus',
    creator: {
      name: '김학생',
      department: '학생회',
    },
    reward: {
      type: 'giftcard',
      value: '스타벅스 기프티콘 3명 추첨',
    },
    estimatedMinutes: 5,
    currentResponses: 142,
    maxResponses: 200,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
  },
  {
    id: 'survey-3',
    title: 'AI와 교육의 미래에 대한 인식조사',
    description: '인공지능 활용 교육에 대한 대학생의 의견을 수집합니다.',
    category: 'academic',
    creator: {
      name: '이교수',
      department: '컴퓨터공학과',
    },
    reward: {
      type: 'point',
      value: 1000,
    },
    estimatedMinutes: 12,
    currentResponses: 8,
    maxResponses: 100,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
  },
  {
    id: 'survey-4',
    title: '졸업생 진로 만족도 조사',
    description: '동문을 대상으로 한 취업 및 진로만족도에 관한 설문',
    category: 'academic',
    creator: {
      name: '박학과',
      department: '학생지도과',
    },
    reward: {
      type: 'point',
      value: 300,
    },
    estimatedMinutes: 10,
    currentResponses: 45,
    maxResponses: 100,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
    isCompleted: true,
  },
  {
    id: 'survey-5',
    title: 'SNS 사용 실태 및 영향 분석',
    description: '대학생의 소셜 미디어 사용 패턴과 심리적 영향에 관한 연구',
    category: 'research',
    creator: {
      name: '최연구원',
      department: '심리학과',
    },
    reward: {
      type: 'point',
      value: 700,
    },
    estimatedMinutes: 15,
    currentResponses: 67,
    maxResponses: 150,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
  },
  {
    id: 'survey-6',
    title: '도서관 이용 만족도 평가',
    description: '도서관 시설 및 서비스에 대한 학생들의 평가',
    category: 'campus',
    creator: {
      name: '도서관',
      department: '학술정보관',
    },
    reward: {
      type: 'giftcard',
      value: '북마크 & 노트 세트 20명',
    },
    estimatedMinutes: 6,
    currentResponses: 89,
    maxResponses: 120,
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 어제 마감
    isClosed: true,
  },
  {
    id: 'survey-7',
    title: '수강신청 시스템 개선 의견',
    description: '현재 수강신청 시스템의 문제점과 개선 방안에 대한 조사',
    category: 'campus',
    creator: {
      name: '학사지원팀',
      department: '교무처',
    },
    reward: {
      type: 'point',
      value: 400,
    },
    estimatedMinutes: 7,
    currentResponses: 156,
    maxResponses: 300,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4일 후
  },
  {
    id: 'survey-8',
    title: '디지털 리터러시 수준 측정',
    description: '대학생의 디지털 능력과 온라인 정보 활용 능력 평가',
    category: 'academic',
    creator: {
      name: '정교수',
      department: '인문학과',
    },
    reward: {
      type: 'point',
      value: 600,
    },
    estimatedMinutes: 11,
    currentResponses: 34,
    maxResponses: 200,
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6일 후
  },
  {
    id: 'survey-9',
    title: '캠퍼스 안전 및 보안 인식 조사',
    description: '학생들이 느끼는 캠퍼스 안전도와 보안 수준 평가',
    category: 'campus',
    creator: {
      name: '안전관리팀',
      department: '시설관리팀',
    },
    reward: {
      type: 'point',
      value: 250,
    },
    estimatedMinutes: 5,
    currentResponses: 203,
    maxResponses: 250,
    deadline: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000), // 2.5일 후
  },
  {
    id: 'survey-10',
    title: '온라인 학습 만족도 및 효과성 평가',
    description: '비대면 강의의 질과 학습 효과에 관한 의견 수집',
    category: 'academic',
    creator: {
      name: '교육개발원',
      department: '교수학습센터',
    },
    reward: {
      type: 'point',
      value: 800,
    },
    estimatedMinutes: 9,
    currentResponses: 112,
    maxResponses: 300,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8일 후
  },
];

export function getDaysUntilDeadline(deadline: Date): number {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    academic: 'primary',
    research: 'info',
    campus: 'success',
    other: 'default',
  };
  return colors[category] || 'default';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    academic: '학술',
    research: '연구',
    campus: '캠퍼스',
    other: '기타',
  };
  return labels[category] || '기타';
}
