# 설문조사 앱 - 설정 가이드

## 📦 1단계: 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

## 🗄️ 2단계: 데이터베이스 마이그레이션

Prisma 스키마에 정의된 모델들을 데이터베이스에 반영합니다.

```bash
npx prisma migrate dev --name init
```

**대화형 메시지가 나타나면:**
- 마이그레이션 이름: `init` (또는 원하는 이름)
- Prisma Client 자동 생성 확인

마이그레이션이 완료되면:
- `prisma/migrations/` 폴더에 마이그레이션 파일 생성
- `prisma/dev.db` SQLite 데이터베이스 생성

## 🔍 3단계: Prisma Studio로 데이터 확인 (선택사항)

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555`로 접속하여 데이터베이스를 시각적으로 관리할 수 있습니다.

## 📋 생성된 데이터베이스 스키마

### 모델 목록
- **User**: 사용자 (학생, 교수, 직원, 관리자)
- **Survey**: 설문 (제목, 상태, 보상 등)
- **Question**: 질문 (단선택, 복선택, 텍스트, 척도 등 6가지 유형)
- **Response**: 응답 (설문 응답 기록)
- **Answer**: 답변 (각 질문의 답변)
- **Notification**: 알림 (사용자 알림)
- **Report**: 신고 (설문 신고)

### 주요 인덱스
- `User`: email, studentId, department, role 인덱싱
- `Survey`: creatorId, status, category, deadline 인덱싱
- `Response`: surveyId, respondentId, isCompleted 인덱싱
- `Question`: surveyId 인덱싱
- `Answer`: responseId, questionId 인덱싱
- `Notification`: userId, isRead, type 인덱싱

## 🌱 초기 데이터 작성 (선택사항)

`prisma/seed.ts`를 생성하여 초기 데이터를 추가할 수 있습니다:

```bash
npx prisma db seed
```

## 🚀 4단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📝 유용한 명령어

```bash
# 스키마 확인
npx prisma validate

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 되돌리기 (개발 환경에서만)
npx prisma migrate resolve --rolled-back <migration_name>

# 데이터베이스 초기화 (주의: 모든 데이터 삭제)
npx prisma migrate reset
```

## 🔒 프로덕션 준비

`.env.production` 파일을 생성하고 다음을 설정하세요:

```env
DATABASE_URL="<production-database-url>"
NEXTAUTH_SECRET="<strong-random-secret>"
NEXTAUTH_URL="https://yourdomain.com"
```

이후 프로덕션 환경에서:
```bash
npx prisma migrate deploy
```

## ⚙️ 주요 설정 파일

- **prisma/schema.prisma**: 데이터베이스 스키마
- **.env**: 환경 변수 (DATABASE_URL, NextAuth 설정)
- **src/lib/db.ts**: Prisma 클라이언트 인스턴스

## 📚 더 알아보기

- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
