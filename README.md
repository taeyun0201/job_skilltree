# Career++

> 오늘의 나를 한 단계 업데이트

Career++는 현재 보유한 기술을 확인하고, 목표 직업에 필요한 기술을 스킬트리 형태로 학습할 수 있는 커리어 성장 서비스입니다. 스킬을 해금해 캐릭터를 성장시키고, 직업별 진행률과 실제 채용공고의 기술 일치율을 확인할 수 있습니다.

## 주요 기능

- 이메일과 비밀번호를 이용한 회원가입 및 로그인
- 최초 로그인 시 닉네임, 캐릭터, 전공, 나이, 관심 분야와 목표 직업 설정
- 목표 직업을 정하지 못한 사용자를 위한 `미정` 선택
- 선수 관계가 연결된 직업별 스킬트리와 스킬 해금
- 해금한 스킬에 따른 경험치, 레벨과 캐릭터 성장 단계 표시
- 5개 직업의 진행률 계산 및 진행률이 높은 커리어 추천
- 스킬 상세 화면에서 추천 강의 제공
- 직업별 채용공고 필터와 보유 스킬 일치율 표시
- 관리자 인증 후 채용공고 등록, 수정 및 삭제
- 개인정보 수정과 계정 삭제

## 지원 직업

- 프론트엔드 개발자
- 풀스택 개발자
- 백엔드 개발자
- 데이터 분석가
- 데이터 사이언티스트

목표 직업을 `미정`으로 설정하면 다섯 직업의 진행률을 모두 비교할 수 있으며, 이후 원하는 직업을 목표로 선택할 수 있습니다. 목표 직업을 선택한 경우에도 다른 직업의 진행률을 상시 확인할 수 있습니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 App Router |
| 언어 | TypeScript |
| UI | React 19, CSS |
| 인증 | Auth.js(NextAuth) Credentials, JWT |
| 데이터베이스 | MongoDB Atlas |
| 비밀번호 암호화 | bcryptjs |
| 배포 | Vercel |

별도의 백엔드 서버 없이 Next.js Route Handler에서 인증, 프로필, 스킬 해금 및 채용공고 API를 처리합니다.

## 시작하기

### 요구 사항

- Node.js 20 이상
- npm
- MongoDB Atlas 데이터베이스

### 설치 및 실행

```bash
npm install
copy .env.example .env.local
npm run dev
```

macOS 또는 Linux에서는 `copy` 대신 아래 명령을 사용합니다.

```bash
cp .env.example .env.local
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경 변수

`.env.local`에 다음 값을 설정합니다.

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=career-skill-tree
AUTH_SECRET=충분히-긴-무작위-문자열
ADMIN_PASSWORD=관리자-비밀번호
```

| 변수 | 설명 |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 |
| `MONGODB_DB` | 사용할 MongoDB 데이터베이스 이름 |
| `AUTH_SECRET` | 로그인 세션 서명에 사용하는 비밀키 |
| `ADMIN_PASSWORD` | 채용공고 관리자 화면에 접속할 때 사용하는 비밀번호 |

`AUTH_SECRET`은 프로젝트 폴더의 터미널에서 다음 명령으로 생성할 수 있습니다.

```bash
npx auth secret
```

## 사용 흐름

1. 회원가입 후 로그인합니다.
2. 모험가 정보와 목표 직업을 설정합니다.
3. 커리어 스킬트리에서 학습 가능한 스킬을 선택합니다.
4. 추천 강의를 참고하고 스킬을 해금합니다.
5. 대시보드에서 레벨과 직업별 진행률을 확인합니다.
6. 채용공고에서 직업 필터와 내 스킬 일치율을 확인합니다.

선수 스킬을 모두 완료한 경우에만 다음 스킬을 해금할 수 있습니다. 같은 기술이 여러 직업에 쓰이는 경우 해금 상태는 공통으로 반영됩니다.

## 주요 화면과 경로

| 경로 | 설명 |
| --- | --- |
| `/` | Career++ 소개 화면 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/onboarding` | 최초 모험가 정보 설정 |
| `/dashboard` | 캐릭터, 성장 정보와 직업별 진행률 |
| `/skill-map` | 커리어 스킬트리와 추천 강의 |
| `/jobs` | 직업별 채용공고와 스킬 일치율 |
| `/admin/jobs` | 비밀번호로 보호된 채용공고 관리 화면 |

## 프로젝트 구조

```text
public/
├─ career-plus-hero.png          랜딩 페이지 배경 이미지
└─ characters/                  성별·캐릭터·레벨별 이미지
src/
├─ app/
│  ├─ (auth)/                   로그인·회원가입
│  ├─ (main)/                   대시보드·스킬트리·채용공고
│  ├─ admin/jobs/               채용공고 관리자 화면
│  ├─ api/                      인증·프로필·스킬·채용공고 API
│  └─ onboarding/               최초 정보 입력
├─ components/
│  ├─ admin/                    채용공고 관리 UI
│  ├─ auth/                     인증 UI
│  ├─ dashboard/                캐릭터와 성장 현황 UI
│  ├─ jobs/                     채용공고 UI
│  ├─ onboarding/               모험가 정보 입력 UI
│  └─ skill-map/                스킬트리와 상세 정보 UI
├─ data/
│  ├─ job-postings.ts           초기 채용공고 데이터
│  ├─ skill-courses.ts          스킬별 추천 강의
│  └─ skill-map.ts              직업·스킬·선수 관계·좌표
├─ lib/                         DB, 관리자 인증, 성장 계산
├─ auth.ts                      Auth.js 설정
└─ proxy.ts                     인증이 필요한 경로 보호
```

## 데이터베이스

주요 MongoDB 컬렉션은 다음과 같습니다.

| 컬렉션 | 저장 내용 |
| --- | --- |
| `users` | 계정, 암호화된 비밀번호, 캐릭터와 프로필 정보 |
| `user_skills` | 사용자별 해금 스킬과 해금 시각 |
| `job_postings` | 관리자 화면에서 관리하는 채용공고 |

계정을 삭제하면 해당 사용자의 `users` 문서와 `user_skills` 문서가 함께 삭제됩니다.
