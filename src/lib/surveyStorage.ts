import { Survey, Question } from '@/utils/seedData';

const SURVEYS_KEY = 'unisurvey_surveys';
const RESPONSES_KEY = 'unisurvey_responses';

// 시드 데이터
const seedSurveys: Survey[] = [
  {
    id: `survey_1`,
    title: '대학생 커리어 준비 현황 조사',
    description: '취업 준비, 인턴십, 자격증 취득, 해외경험 등 대학생의 커리어 계획에 관한 설문입니다.',
    category: 'RESEARCH',
    createdAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'user1', department: '전자공학과' },
    currentResponses: 73,
    maxResponses: 120,
    estimatedMinutes: 12,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 700,
    status: 'ACTIVE',
    creatorId: 'user_2',
    questions: [
      {
        id: 'q1',
        type: 'radio',
        question: '현재 취업 준비 단계는?',
        options: ['아직 시작 안 함', '정보 수집 중', '적극 준비 중', '이미 취업함'],
      },
      {
        id: 'q2',
        type: 'radio',
        question: '취득한 자격증 수는?',
        options: ['0개', '1~2개', '3~4개', '5개 이상'],
      },
      {
        id: 'q3',
        type: 'radio',
        question: '인턴십 경험이 있나요?',
        options: ['없음', '1회', '2회 이상'],
      },
      {
        id: 'q4',
        type: 'checkbox',
        question: '취업 준비에서 가장 어려운 점은?',
        options: ['정보 부족', '스펙 부족', '방향 설정', '시간 부족', '비용'],
      },
      {
        id: 'q5',
        type: 'textarea',
        question: '추가 의견',
      },
    ],
  },
  {
    id: `survey_2`,
    title: '스트리밍 서비스 이용 실태 조사',
    description: '대학생의 영상 스트리밍 서비스 이용 습관, 선호 장르, 비용 지출에 관한 설문입니다.',
    category: 'OTHER',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'admin', department: '컴퓨터공학과' },
    currentResponses: 31,
    maxResponses: 100,
    estimatedMinutes: 8,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 400,
    status: 'ACTIVE',
    creatorId: 'user_1',
    questions: [
      {
        id: 'q1',
        type: 'checkbox',
        question: '주로 이용하는 스트리밍 서비스는?',
        options: ['넷플릭스', '유튜브 프리미엄', '웨이브', '디즈니+', '쿠팡플레이', '기타'],
      },
      {
        id: 'q2',
        type: 'radio',
        question: '월 평균 이용 시간은?',
        options: ['10시간 미만', '10~30시간', '30~60시간', '60시간 이상'],
      },
      {
        id: 'q3',
        type: 'radio',
        question: '월 지출 금액은?',
        options: ['무료만', '1만원 미만', '1~3만원', '3만원 이상'],
      },
      {
        id: 'q4',
        type: 'scale',
        question: '서비스 선택 시 가장 중요한 요소는?',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: '전혀 중요하지 않음', max: '매우 중요함' },
      },
    ],
  },
  {
    id: `survey_3`,
    title: '대학 도서관 이용 패턴 분석',
    description: '도서관 자료, 열람실, 스터디 공간 이용 현황을 파악하기 위한 학술 설문입니다.',
    category: 'ACADEMIC',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'user2', department: '기계공학과' },
    currentResponses: 52,
    maxResponses: 120,
    estimatedMinutes: 12,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 600,
    status: 'ACTIVE',
    creatorId: 'user_3',
    questions: [
      {
        id: 'q1',
        type: 'radio',
        question: '도서관 주간 방문 횟수는?',
        options: ['거의 안 감', '1~2회', '3~4회', '매일'],
      },
      {
        id: 'q2',
        type: 'checkbox',
        question: '주로 이용하는 공간은?',
        options: ['열람실', '스터디룸', '자료실', '카페 공간'],
      },
      {
        id: 'q3',
        type: 'scale',
        question: '도서관 만족도는?',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: '매우 불만족', max: '매우 만족' },
      },
      {
        id: 'q4',
        type: 'textarea',
        question: '개선이 필요한 점은?',
      },
    ],
  },
  {
    id: `survey_4`,
    title: '2024년 캠퍼스 생활만족도 조사',
    description: '우리 대학의 캠퍼스 시설, 학생 서비스, 커뮤니티에 대한 만족도를 조사하고 있습니다.',
    category: 'ACADEMIC',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'admin', department: '컴퓨터공학과' },
    currentResponses: 45,
    maxResponses: 100,
    estimatedMinutes: 10,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 500,
    status: 'ACTIVE',
    creatorId: 'user_1',
    questions: [
      {
        id: 'q1',
        type: 'scale',
        question: '캠퍼스 시설에 만족하신가요?',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: '매우 불만족', max: '매우 만족' },
      },
      {
        id: 'q2',
        type: 'checkbox',
        question: '개선이 필요한 시설은?',
        options: ['도서관', '학생 식당', '체육관', '강의실', '편의점', '기타'],
      },
      {
        id: 'q3',
        type: 'radio',
        question: '학생 지원 서비스는 충분한가요?',
        options: ['매우 부족', '부족', '적절함', '충분함'],
      },
    ],
  },
  {
    id: `survey_5`,
    title: '대학생 온라인 쇼핑 이용행태 연구',
    description: 'MZ세대 대학생의 온라인 쇼핑 습관과 선호도에 관한 학술 연구입니다. 약 15분 소요됩니다.',
    category: 'RESEARCH',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'user1', department: '전자공학과' },
    currentResponses: 28,
    maxResponses: 80,
    estimatedMinutes: 15,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 800,
    status: 'ACTIVE',
    creatorId: 'user_2',
    questions: [
      {
        id: 'q1',
        type: 'checkbox',
        question: '주로 이용하는 쇼핑 플랫폼은?',
        options: ['쿠팡', '배민마켓', '마켓컬리', '무신사', '쿠쿠', 'GS FRESH', '기타'],
      },
      {
        id: 'q2',
        type: 'radio',
        question: '월 평균 온라인 쇼핑 횟수는?',
        options: ['1~2회', '3~5회', '6~10회', '10회 이상'],
      },
      {
        id: 'q3',
        type: 'scale',
        question: '빠른 배송이 구매 결정에 미치는 영향은?',
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: '영향 없음', max: '매우 영향 큼' },
      },
    ],
  },
  {
    id: `survey_6`,
    title: '학생 식당 메뉴 개선안 설문',
    description: '학생식당 메뉴 만족도와 개선 사항에 대한 의견을 수렴합니다. 캠퍼스 시설 개선에 반영됩니다.',
    category: 'CAMPUS',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { nickname: 'admin', department: '컴퓨터공학과' },
    currentResponses: 67,
    maxResponses: 150,
    estimatedMinutes: 5,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    rewardType: 'POINT',
    rewardAmount: 300,
    status: 'ACTIVE',
    creatorId: 'user_1',
    questions: [
      {
        id: 'q1',
        type: 'radio',
        question: '학생 식당 메뉴에 만족하신가요?',
        options: ['매우 불만족', '불만족', '보통', '만족', '매우 만족'],
      },
      {
        id: 'q2',
        type: 'checkbox',
        question: '추가되었으면 하는 메뉴는?',
        options: ['한식', '중식', '일식', '양식', '채식', '건강식', '기타'],
      },
      {
        id: 'q3',
        type: 'textarea',
        question: '개선 의견을 작성해주세요.',
      },
    ],
  },
];

// 모든 설문 가져오기
export function getAllSurveys(): Survey[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SURVEYS_KEY);
    if (!stored) {
      localStorage.setItem(SURVEYS_KEY, JSON.stringify(seedSurveys));
      return seedSurveys;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to get surveys:', e);
    return seedSurveys;
  }
}

// 설문 1개 가져오기
export function getSurveyById(id: string): Survey | null {
  const surveys = getAllSurveys();
  return surveys.find((s) => s.id === id) || null;
}

// 새 설문 추가 (발행)
export function addSurvey(survey: Survey): Survey {
  const surveys = getAllSurveys();
  surveys.unshift(survey); // 맨 앞에 추가
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
  return survey;
}

// 내가 만든 설문
export function getMySurveys(nickname: string): Survey[] {
  return getAllSurveys().filter((s) => s.creator?.nickname === nickname);
}

// 응답 저장
export function addResponse(surveyId: string, answers: Record<string, any>, nickname: string) {
  try {
    const responses = JSON.parse(localStorage.getItem(RESPONSES_KEY) || '[]');
    responses.push({
      surveyId,
      answers,
      nickname,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));

    // 설문의 currentResponses 증가
    const surveys = getAllSurveys();
    const idx = surveys.findIndex((s) => s.id === surveyId);
    if (idx !== -1) {
      surveys[idx].currentResponses = (surveys[idx].currentResponses || 0) + 1;
      localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
    }
  } catch (e) {
    console.error('Failed to add response:', e);
  }
}

// 내가 참여한 설문
export function getMyResponses(nickname: string) {
  try {
    const responses = JSON.parse(localStorage.getItem(RESPONSES_KEY) || '[]');
    return responses.filter((r: any) => r.nickname === nickname);
  } catch (e) {
    console.error('Failed to get responses:', e);
    return [];
  }
}
