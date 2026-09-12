# Career Skill Tree

취업을 준비하는 사용자가 목표 직업의 필수 기술을 스킬트리로 탐색하고, 학습한 기술을 해금해 RPG 캐릭터를 성장시키는 4인 해커톤 프로젝트입니다.

## MVP 목표

6시간 안에 아래 데모 흐름을 완성합니다.

1. 회원가입 후 최초 프로필과 목표 직업을 설정합니다.
2. 대시보드에서 캐릭터, 레벨, 경험치와 보유 스킬을 확인합니다.
3. 지도형 스킬맵에서 스킬과 선수 관계를 탐색합니다.
4. 학습 완료 버튼으로 스킬을 해금하고 경험치를 얻습니다.
5. 목표 직업을 변경해도 공통 스킬의 해금 상태가 유지됩니다.

직업은 프론트엔드와 백엔드 2개, 고유 스킬은 총 10~12개, 캐릭터 이미지는 성장 단계 2개로 제한합니다. 퀴즈, AI 추천, 실시간 채용 데이터, 장비와 인벤토리는 이번 MVP 범위에서 제외합니다.

## 기술 스택

- Next.js App Router + TypeScript
- React
- MongoDB Atlas / MongoDB Node.js Driver
- Vercel

별도의 백엔드 서버 없이 Next.js Route Handler에서 MongoDB에 접근합니다. 직업, 스킬, 지도 좌표는 `src/data/skill-map.ts`에서 관리하고 사용자 프로필과 해금 기록만 MongoDB에 저장합니다.

## 시작하기

요구 사항: Node.js 20 이상, npm, MongoDB Atlas 데이터베이스

```bash
npm install
copy .env.example .env.local
npm run dev
```

macOS/Linux에서는 두 번째 명령 대신 `cp .env.example .env.local`을 사용합니다. `.env.local`에 실제 `MONGODB_URI`와 `MONGODB_DB` 값을 입력하고 [http://localhost:3000](http://localhost:3000)을 엽니다.

배포 전 확인 명령은 다음과 같습니다.

```bash
npm run build
```

## 환경 변수

| 이름 | 용도 | 공개 여부 |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB Atlas 접속 문자열 | 서버 전용 |
| `MONGODB_DB` | 사용할 데이터베이스 이름 | 서버 전용 |
| `DEMO_USER_ID` | 인증 연결 전 임시 사용자 ID | 서버 전용 |

실제 값이 들어 있는 `.env.local`은 Git에 올리지 않습니다. Vercel 프로젝트의 Settings → Environment Variables에도 같은 값을 등록합니다.

## 디렉터리 구조

```text
public/characters/                도트 캐릭터 이미지
src/
├─ app/
│  ├─ (auth)/                     로그인·회원가입
│  ├─ (main)/dashboard/           캐릭터 대시보드
│  ├─ (main)/skill-map/           스킬맵 화면
│  ├─ onboarding/                 최초 사용자 설정
│  └─ api/                        Next.js Route Handler
├─ components/
│  ├─ auth/                       인증 폼
│  ├─ dashboard/                  캐릭터·성장 요약
│  ├─ onboarding/                 프로필 입력
│  └─ skill-map/                  지도·노드·상세 패널
├─ data/skill-map.ts              고정 직업·스킬·좌표 데이터
├─ lib/                           MongoDB·성장 규칙
└─ types/                         팀 공통 TypeScript 타입
```

## 4인 작업 분담

| 담당 | 작업 범위 | 주 작업 경로 |
| --- | --- | --- |
| 1. 인증·온보딩 | 실제 인증, 최초 로그인 분기, 프로필 저장 | `src/app/(auth)`, `src/app/onboarding`, `src/components/auth`, `src/components/onboarding` |
| 2. 대시보드·캐릭터 | 캐릭터 이미지, 경험치 바, 성장 요약 | `src/app/(main)/dashboard`, `src/components/dashboard`, `public/characters` |
| 3. 스킬맵 | 지도 드래그/줌, 연결선, 상세 패널, 직업 전환 | `src/app/(main)/skill-map`, `src/components/skill-map`, `src/data/skill-map.ts` |
| 4. DB·API·배포 | MongoDB 모델, 프로필/해금 API, 중복 방지, Vercel | `src/app/api`, `src/lib`, 환경 변수와 배포 설정 |

`src/types/index.ts`와 API 응답 형식은 네 명이 함께 합의한 뒤 변경합니다. 공통 파일을 수정해야 하면 먼저 팀 채널에 알려 충돌을 줄입니다.

## 기능별 수정 파일

아래 표에서 맡은 기능의 **주 수정 파일**을 먼저 작업합니다. 연동 파일은 해당 기능을 실제 데이터와 연결할 때 함께 수정합니다.

| 기능 | 주 수정 파일 | 연동하거나 함께 확인할 파일 | 구현 내용 |
| --- | --- | --- | --- |
| 랜딩 페이지 | `src/app/page.tsx` | `src/app/globals.css`, `src/app/layout.tsx` | 서비스 소개와 로그인·회원가입 진입 버튼 |
| 로그인 | `src/app/(auth)/login/page.tsx`, `src/components/auth/AuthForm.tsx` | `src/app/(main)/layout.tsx` | 실제 로그인 요청, 오류 표시, 로그인 후 이동 |
| 회원가입 | `src/app/(auth)/signup/page.tsx`, `src/components/auth/AuthForm.tsx` | `src/app/onboarding/page.tsx` | 계정 생성과 최초 온보딩 이동 |
| 인증 보호 | `src/app/(main)/layout.tsx` | 인증 담당자가 추가할 `src/lib/auth.ts` | 비로그인 사용자의 접근 차단과 로그인 화면 이동 |
| 최초 온보딩 | `src/app/onboarding/page.tsx`, `src/components/onboarding/OnboardingForm.tsx` | `src/app/api/profile/route.ts`, `src/types/index.ts` | 닉네임·캐릭터·전공·나이·관심 분야·목표 직업 저장 |
| 개인 대시보드 | `src/app/(main)/dashboard/page.tsx` | `src/app/api/profile/route.ts` | 로그인 사용자의 캐릭터와 성장 정보 조회 |
| 캐릭터 표시 | `src/components/dashboard/CharacterCard.tsx` | `public/characters/`, `src/lib/progression.ts` | 레벨별 도트 이미지와 경험치 바 표시 |
| 성장 요약 | `src/components/dashboard/SkillSummary.tsx` | `src/app/api/profile/route.ts`, `src/lib/progression.ts` | 목표 직업, 해금 수, 다음 추천 스킬 표시 |
| 스킬맵 화면 | `src/app/(main)/skill-map/page.tsx`, `src/components/skill-map/SkillMap.tsx` | `src/data/skill-map.ts`, `src/app/api/skill-map/route.ts` | 지도 렌더링, 드래그·확대·축소, 노드 연결선 |
| 스킬 노드 상태 | `src/components/skill-map/SkillMap.tsx` | `src/types/index.ts`, `src/app/api/skill-map/route.ts` | 잠김·학습 가능·완료 상태별 스타일과 클릭 처리 |
| 스킬 상세·해금 | `src/components/skill-map/SkillDetail.tsx` | `src/app/api/skills/[skillId]/unlock/route.ts` | 설명·선수 조건·XP 표시와 해금 요청 |
| 직업·스킬 콘텐츠 | `src/data/skill-map.ts` | `src/types/index.ts` | 직업, 스킬, 선수 관계, 공통 스킬 ID, 지도 좌표 |
| 프로필 API | `src/app/api/profile/route.ts` | `src/lib/mongodb.ts`, `src/types/index.ts` | 프로필 조회, 온보딩 저장, 목표 직업 변경 |
| 스킬맵 API | `src/app/api/skill-map/route.ts` | `src/data/skill-map.ts`, `src/lib/mongodb.ts` | 고정 지도 데이터와 사용자 해금 상태 결합 |
| 스킬 해금 API | `src/app/api/skills/[skillId]/unlock/route.ts` | `src/lib/mongodb.ts`, `src/lib/progression.ts`, `src/data/skill-map.ts` | 선수 조건 검사, 중복 방지, 해금 저장, 성장 결과 반환 |
| MongoDB 연결 | `src/lib/mongodb.ts` | `.env.local`, `.env.example` | Vercel 환경에서 재사용 가능한 DB 연결 |
| 경험치·레벨 | `src/lib/progression.ts` | `src/components/dashboard/CharacterCard.tsx` | 총 XP, 현재 레벨, 현재 레벨 경험치 계산 |
| 공통 타입 | `src/types/index.ts` | 이 타입을 import하는 모든 파일 | API와 컴포넌트가 공유하는 데이터 구조 |
| 공통 레이아웃·스타일 | `src/app/layout.tsx`, `src/app/globals.css` | 전체 화면 | 헤더, 내비게이션, 색상과 공통 UI 스타일 |
| Vercel 배포 | `package.json`, `next.config.ts`, `.env.example` | Vercel 프로젝트 설정 | 빌드 설정과 환경 변수 등록 |

### 담당자별 바로 시작할 파일

1. **인증·온보딩 담당:** `src/components/auth/AuthForm.tsx` → `src/components/onboarding/OnboardingForm.tsx` → `src/app/api/profile/route.ts`
2. **대시보드·캐릭터 담당:** `src/app/(main)/dashboard/page.tsx` → `src/components/dashboard/CharacterCard.tsx` → `src/components/dashboard/SkillSummary.tsx`
3. **스킬맵 담당:** `src/components/skill-map/SkillMap.tsx` → `src/components/skill-map/SkillDetail.tsx` → `src/data/skill-map.ts`
4. **DB·API·배포 담당:** `src/lib/mongodb.ts` → `src/app/api/profile/route.ts` → `src/app/api/skills/[skillId]/unlock/route.ts`

`src/types/index.ts`, `src/data/skill-map.ts`, `src/app/globals.css`, `package.json`은 여러 담당자가 사용할 가능성이 큰 공통 파일입니다. 수정 전에 담당자끼리 알려 같은 줄을 동시에 변경하지 않도록 합니다.

## Git 협업 규칙

각자 `main`에서 작업 브랜치를 만들고 Pull Request로 병합합니다.

```bash
git switch main
git pull origin main
git switch -c feat/skill-map
```

브랜치 이름은 `feat/기능명`, `fix/문제명`, `chore/작업명` 형식을 사용합니다. 커밋은 한 기능 단위로 작게 만들고, PR에는 변경 내용과 직접 확인한 테스트를 적습니다. 공통 타입과 데이터 구조 변경은 PR 설명에 반드시 표시합니다.

## 데이터 규칙

- 같은 스킬은 여러 직업에서 사용해도 하나의 `skillId`를 공유합니다.
- 해금 기록은 `userId + skillId` 복합 유니크 인덱스로 중복 저장을 막습니다.
- 스킬당 50 XP, 100 XP마다 레벨이 1 오릅니다.
- 선수 스킬을 모두 완료한 경우에만 서버에서 해금을 허용합니다.
- 클라이언트가 보낸 사용자 ID, 경험치, 완료 상태를 그대로 신뢰하지 않습니다.

예상 MongoDB 컬렉션은 `users`와 `user_skills` 두 개입니다.

```js
// MongoDB Atlas 또는 mongosh에서 최초 1회 실행
db.user_skills.createIndex({ userId: 1, skillId: 1 }, { unique: true })
```

## API 계약

| 메서드와 경로 | 역할 | 현재 상태 |
| --- | --- | --- |
| `GET /api/health` | 서버 상태 확인 | 구현됨 |
| `GET /api/profile` | 내 프로필과 성장 정보 조회 | 담당자 연결 필요 |
| `PATCH /api/profile` | 온보딩과 목표 직업 저장 | 담당자 연결 필요 |
| `GET /api/skill-map` | 직업·스킬·위치 데이터 조회 | 예제 데이터 구현됨 |
| `POST /api/skills/:skillId/unlock` | 선수 조건 검사와 해금 저장 | 담당자 연결 필요 |

## Vercel 배포

1. GitHub 저장소를 Vercel에 연결합니다.
2. Framework Preset은 Next.js를 사용합니다.
3. `MONGODB_URI`, `MONGODB_DB`, `DEMO_USER_ID`를 환경 변수로 등록합니다.
4. MongoDB Atlas Network Access에서 배포 환경의 접속을 허용합니다.
5. `main` 브랜치를 Production Branch로 지정하고 배포합니다.

## 데모 완료 기준

- 새 사용자가 회원가입 → 온보딩 → 대시보드 → 스킬맵으로 이동할 수 있습니다.
- 잠긴 스킬은 선수 조건을 충족하기 전 해금할 수 없습니다.
- 같은 스킬을 여러 번 눌러도 경험치가 중복 지급되지 않습니다.
- 새로고침과 재로그인 후에도 해금 기록이 유지됩니다.
- 공통 스킬은 목표 직업을 바꿔도 완료 상태로 표시됩니다.
- Vercel 배포 주소에서 전체 흐름을 시연할 수 있습니다.
