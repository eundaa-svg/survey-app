'use client';

const SURVEYS_KEY = 'unisurvey_surveys';
const RESPONSES_KEY = 'unisurvey_responses';

function createSeedSurveys() {
  return [
    {
      id: 'seed_1',
      title: '대학생 커리어 준비 현황 조사',
      description: '취업 준비, 인턴십, 자격증 취득, 해외경험 등 대학생의 커리어 계획에 관한 설문입니다.',
      category: '연구',
      creator: { nickname: 'user1', department: '전자공학과' },
      rewardType: 'POINT',
      rewardAmount: 700,
      estimatedMinutes: 12,
      deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
      maxResponses: 120,
      currentResponses: 73,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'SINGLE_CHOICE', title: '현재 취업 준비 단계는?', isRequired: true, options: ['아직 시작 안 함', '정보 수집 중', '적극 준비 중', '이미 취업함'] },
        { id: 'q2', type: 'SINGLE_CHOICE', title: '취득한 자격증 수는?', isRequired: true, options: ['0개', '1~2개', '3~4개', '5개 이상'] },
        { id: 'q3', type: 'MULTIPLE_CHOICE', title: '취업 준비에서 가장 어려운 점은?', isRequired: true, options: ['정보 부족', '스펙 부족', '방향 설정', '시간 부족', '비용'] },
        { id: 'q4', type: 'LONG_TEXT', title: '추가 의견을 자유롭게 작성해주세요', isRequired: false, options: [] }
      ]
    },
    {
      id: 'seed_2',
      title: '스트리밍 서비스 이용 실태 조사',
      description: '대학생의 영상 스트리밍 서비스 이용 습관, 선호 장르, 비용 지출에 관한 설문입니다.',
      category: '기타',
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      rewardType: 'POINT',
      rewardAmount: 400,
      estimatedMinutes: 8,
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      maxResponses: 100,
      currentResponses: 31,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'MULTIPLE_CHOICE', title: '주로 이용하는 스트리밍 서비스는?', isRequired: true, options: ['넷플릭스', '유튜브 프리미엄', '웨이브', '디즈니+', '쿠팡플레이'] },
        { id: 'q2', type: 'SINGLE_CHOICE', title: '월 평균 이용 시간은?', isRequired: true, options: ['10시간 미만', '10~30시간', '30~60시간', '60시간 이상'] },
        { id: 'q3', type: 'SINGLE_CHOICE', title: '월 지출 금액은?', isRequired: true, options: ['무료만', '1만원 미만', '1~3만원', '3만원 이상'] }
      ]
    },
    {
      id: 'seed_3',
      title: '대학 도서관 이용 패턴 분석',
      description: '도서관 자료, 열람실, 스터디 공간 이용 현황을 파악하기 위한 학술 설문입니다.',
      category: '학술',
      creator: { nickname: 'user2', department: '기계공학과' },
      rewardType: 'POINT',
      rewardAmount: 600,
      estimatedMinutes: 12,
      deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
      maxResponses: 120,
      currentResponses: 52,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'SINGLE_CHOICE', title: '도서관 주간 방문 횟수는?', isRequired: true, options: ['거의 안 감', '1~2회', '3~4회', '매일'] },
        { id: 'q2', type: 'MULTIPLE_CHOICE', title: '주로 이용하는 공간은?', isRequired: true, options: ['열람실', '스터디룸', '자료실', '카페 공간'] },
        { id: 'q3', type: 'SCALE', title: '도서관 만족도는?', isRequired: true, options: ['1', '2', '3', '4', '5'] },
        { id: 'q4', type: 'LONG_TEXT', title: '개선이 필요한 점은?', isRequired: false, options: [] }
      ]
    },
    {
      id: 'seed_4',
      title: '학생 식당 메뉴 개선안 설문',
      description: '학생식당 메뉴 만족도와 개선 사항에 대한 의견을 수렴합니다.',
      category: '캠퍼스',
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      rewardType: 'POINT',
      rewardAmount: 300,
      estimatedMinutes: 5,
      deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
      maxResponses: 150,
      currentResponses: 67,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'SCALE', title: '현재 학생식당 만족도는?', isRequired: true, options: ['1', '2', '3', '4', '5'] },
        { id: 'q2', type: 'MULTIPLE_CHOICE', title: '개선이 필요한 부분은?', isRequired: true, options: ['맛', '가격', '메뉴 다양성', '위생', '대기 시간'] },
        { id: 'q3', type: 'LONG_TEXT', title: '추가 의견', isRequired: false, options: [] }
      ]
    },
    {
      id: 'seed_5',
      title: '대학생 온라인 쇼핑 이용행태 연구',
      description: 'MZ세대 대학생의 온라인 쇼핑 습관과 선호도에 관한 학술 연구입니다.',
      category: '연구',
      creator: { nickname: 'user1', department: '전자공학과' },
      rewardType: 'POINT',
      rewardAmount: 800,
      estimatedMinutes: 15,
      deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
      maxResponses: 80,
      currentResponses: 28,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'SINGLE_CHOICE', title: '월 평균 온라인 쇼핑 횟수는?', isRequired: true, options: ['1회 미만', '1~3회', '4~7회', '8회 이상'] },
        { id: 'q2', type: 'MULTIPLE_CHOICE', title: '주로 구매하는 품목은?', isRequired: true, options: ['의류', '식품', '전자기기', '도서', '생활용품', '뷰티'] },
        { id: 'q3', type: 'SINGLE_CHOICE', title: '월 평균 지출 금액은?', isRequired: true, options: ['5만원 미만', '5~10만원', '10~20만원', '20만원 이상'] }
      ]
    },
    {
      id: 'seed_6',
      title: '2024년 캠퍼스 생활만족도 조사',
      description: '우리 대학의 캠퍼스 시설, 학생 서비스, 커뮤니티에 대한 만족도를 조사하고 있습니다.',
      category: '학술',
      creator: { nickname: 'admin', department: '컴퓨터공학과' },
      rewardType: 'POINT',
      rewardAmount: 500,
      estimatedMinutes: 10,
      deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
      maxResponses: 100,
      currentResponses: 45,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      status: 'ACTIVE',
      questions: [
        { id: 'q1', type: 'SCALE', title: '캠퍼스 시설 만족도는?', isRequired: true, options: ['1', '2', '3', '4', '5'] },
        { id: 'q2', type: 'SCALE', title: '학생 서비스 만족도는?', isRequired: true, options: ['1', '2', '3', '4', '5'] },
        { id: 'q3', type: 'MULTIPLE_CHOICE', title: '가장 개선이 필요한 분야는?', isRequired: true, options: ['강의실', '도서관', '기숙사', '식당', '체육시설', '동아리 공간'] },
        { id: 'q4', type: 'LONG_TEXT', title: '자유 의견', isRequired: false, options: [] }
      ]
    }
  ];
}

export function loadSurveys() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SURVEYS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const seeds = createSeedSurveys();
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(seeds));
  return seeds;
}

export function saveSurveys(surveys: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
}

export function findSurvey(id: string) {
  const all = loadSurveys();
  return all.find(s => s.id === id) || null;
}

export function publishSurvey(survey: any) {
  const all = loadSurveys();
  all.unshift(survey);
  saveSurveys(all);
}

export function getMySurveys(nickname: string) {
  return loadSurveys().filter(s => s.creator?.nickname === nickname);
}

export function addResponse(surveyId: string, answers: any, nickname: string) {
  if (typeof window === 'undefined') return;
  const responses = JSON.parse(localStorage.getItem(RESPONSES_KEY) || '[]');
  responses.push({ surveyId, answers, nickname, createdAt: new Date().toISOString() });
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  const surveys = loadSurveys();
  const idx = surveys.findIndex(s => s.id === surveyId);
  if (idx !== -1) {
    surveys[idx].currentResponses = (surveys[idx].currentResponses || 0) + 1;
    saveSurveys(surveys);
  }
}

export function getMyResponses(nickname: string) {
  if (typeof window === 'undefined') return [];
  const responses = JSON.parse(localStorage.getItem(RESPONSES_KEY) || '[]');
  return responses.filter((r: any) => r.nickname === nickname);
}
