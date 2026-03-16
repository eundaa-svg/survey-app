# 설문조사 앱 🎓

Next.js 14, TypeScript, Tailwind CSS를 기반으로 한 현대적인 설문 플랫폼입니다.

## ✨ 주요 기능

### 사용자 관리
- 학생, 교수, 직원, 관리자의 역할 기반 접근 제어
- 학과 및 학년별 타겟팅
- 포인트 리워드 시스템

### 설문 관리
- 다양한 질문 유형 지원 (단선택, 복선택, 텍스트, 척도, 매트릭스)
- 설문 상태 관리 (초안, 진행중, 종료, 완료)
- 카테고리 분류 (학술, 연구, 캠퍼스, 기타)
- 마감일 및 최대 응답자 수 설정

### 보상 시스템
- 포인트, 기프트카드, 커스텀 보상 지원
- 응답 완료 후 자동 포인트 지급

### 분석 기능
- 실시간 응답 통계
- 다양한 차트 시각화 (막대, 도넛, 척도, 히트맵)
- 응답률 및 완료율 분석

### 알림 시스템
- 새로운 설문 알림
- 마감일 임박 알림
- 보상 관련 알림
- 신고 및 시스템 알림

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- npm / yarn / pnpm

### 설치

```bash
# 1. 의존성 설치
npm install

# 2. 데이터베이스 마이그레이션
npm run db:migrate

# 3. 초기 데이터 추가 (선택사항)
npm run db:seed

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 자세한 설정 가이드
[SETUP.md](./SETUP.md) 참조

## 📂 프로젝트 구조

```
survey-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 페이지 (로그인, 회원가입)
│   │   ├── (main)/            # 메인 피드
│   │   ├── survey/            # 설문 관련 페이지
│   │   ├── mypage/            # 마이페이지
│   │   ├── admin/             # 관리자 대시보드
│   │   ├── api/               # API 라우트
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 글로벌 스타일
│   ├── components/
│   │   ├── ui/                # 기본 UI 컴포넌트 (Button, Input, Card 등)
│   │   ├── survey/            # 설문 관련 컴포넌트
│   │   ├── layout/            # 레이아웃 컴포넌트 (Header, Sidebar)
│   │   └── chart/             # 차트 컴포넌트
│   ├── lib/
│   │   ├── db.ts              # Prisma 클라이언트
│   │   ├── auth.ts            # NextAuth 설정
│   │   └── utils.ts           # 유틸리티 함수
│   ├── hooks/                 # React Hooks
│   ├── types/                 # TypeScript 타입 정의
│   └── stores/                # Zustand 상태 관리
├── prisma/
│   ├── schema.prisma          # 데이터베이스 스키마
│   └── seed.ts                # 초기 데이터
├── public/                    # 정적 파일
├── .env                       # 환경 변수
└── package.json              # 프로젝트 설정
```

## 🎨 디자인 시스템

Google Forms의 디자인 언어를 기반으로 합니다.

### 색상 팔레트
- **주색상**: `#673ab7` (퍼플)
- **배경**: `#f0ebf8` (연한 라벤더)
- **성공**: `#4caf50` (초록색)
- **경고**: `#ff9800` (주황색)
- **오류**: `#f44336` (빨간색)

### 폰트
- Google Sans (영문)
- Noto Sans KR (한글)

### 컴포넌트
- 버튼: `rounded-full`
- 카드: `rounded-xl`, subtle shadow
- 인풋: `rounded-lg`, focus 상태 명확함

## 📊 데이터베이스 스키마

### 주요 모델
- **User**: 사용자 정보 및 역할
- **Survey**: 설문 메타데이터
- **Question**: 설문 질문
- **Response**: 사용자의 응답 기록
- **Answer**: 각 질문의 답변
- **Notification**: 사용자 알림
- **Report**: 신고 기능

### 성능 최적화
- Survey: creatorId, status, deadline, category 인덱싱
- Response: surveyId, respondentId, isCompleted 인덱싱
- Question: surveyId 인덱싱
- User: email, studentId, role 인덱싱

자세한 스키마: [prisma/schema.prisma](./prisma/schema.prisma)

## 📦 주요 의존성

### 프론트엔드
- **Next.js 14**: React 프레임워크
- **React 18**: UI 라이브러리
- **Tailwind CSS 3**: CSS 프레임워크
- **Lucide React**: 아이콘 라이브러리
- **Zustand**: 상태 관리
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증

### 백엔드
- **Prisma**: ORM
- **NextAuth.js**: 인증
- **Recharts**: 차트 라이브러리

### 기타
- **date-fns**: 날짜 유틸리티
- **@dnd-kit**: 드래그 앤 드롭

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 실행
npm run lint

# 데이터베이스 마이그레이션
npm run db:migrate

# Prisma Studio 실행
npm run db:studio

# 초기 데이터 추가
npm run db:seed

# 데이터베이스 초기화
npm run db:reset
```

## 🔒 보안

### 인증
- NextAuth.js를 통한 세션 관리
- 비밀번호 암호화 (bcrypt 권장)
- CSRF 보호

### 인가
- 역할 기반 접근 제어 (RBAC)
- API 미들웨어를 통한 권한 검증

### 데이터 보호
- 환경 변수 사용
- 입력 값 검증 (Zod)
- SQL Injection 방지 (Prisma ORM 사용)

## 📝 TODO

- [ ] NextAuth 구현 완료
- [ ] API 라우트 구현
- [ ] 설문 결과 내보내기 (CSV)
- [ ] 고급 필터링 및 검색
- [ ] 모바일 앱 (React Native)
- [ ] 다국어 지원
- [ ] 다크 모드

## 📄 라이선스

MIT

## 👨‍💻 개발자

개발 가이드는 [SETUP.md](./SETUP.md) 참조

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하면 GitHub Issues를 통해 보고해주세요.
