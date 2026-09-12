import type { Job, Skill } from "@/types";

export const JOBS: Job[] = [
  {
    id: "frontend",
    name: "프론트엔드 개발자",
    description: "웹 화면과 사용자 경험을 구현합니다.",
    position: { x: 420, y: 400 },
    themeColor: "#36d7ff",
  },
  {
    id: "fullstack",
    name: "풀스택 개발자",
    description: "프론트엔드와 백엔드를 연결해 완성된 서비스를 만듭니다.",
    position: { x: 1730, y: 360 },
    themeColor: "#f4c542",
  },
  {
    id: "backend",
    name: "백엔드 개발자",
    description: "서버, API, 데이터베이스와 배포 환경을 구현합니다.",
    position: { x: 3070, y: 400 },
    themeColor: "#ff8a4c",
  },
  {
    id: "data-analyst",
    name: "데이터 분석가",
    description: "데이터를 정리하고 시각화해 비즈니스 문제를 해결합니다.",
    position: { x: 920, y: 2070 },
    themeColor: "#72df8f",
  },
  {
    id: "data-scientist",
    name: "데이터 사이언티스트",
    description: "통계와 머신러닝으로 예측 모델과 데이터 제품을 만듭니다.",
    position: { x: 2680, y: 2070 },
    themeColor: "#b18cff",
  },
];

const JOB_OFFSETS: Record<string, { x: number; y: number }> = {
  frontend: { x: 0, y: 0 },
  fullstack: { x: 500, y: 0 },
  backend: { x: 1000, y: 0 },
  "data-analyst": { x: 300, y: 700 },
  "data-scientist": { x: 1000, y: 700 },
};

function defineSkill(
  jobId: string,
  skillKey: string,
  name: string,
  description: string,
  xp: number,
  prerequisiteKeys: string[],
  x: number,
  y: number,
): Skill {
  const offset = JOB_OFFSETS[jobId] ?? { x: 0, y: 0 };
  return {
    id: jobId + ":" + skillKey,
    skillKey,
    name,
    description,
    xp,
    jobIds: [jobId],
    prerequisiteIds: prerequisiteKeys.map((key) => jobId + ":" + key),
    position: { x: x + offset.x, y: y + offset.y },
    status: prerequisiteKeys.length === 0 ? "available" : "locked",
  };
}

export const SKILLS: Skill[] = [
  // Frontend Developer
  defineSkill("frontend", "html", "HTML", "웹 문서의 구조와 시맨틱 태그를 배웁니다.", 70, [], 80, 250),
  defineSkill("frontend", "css", "CSS", "레이아웃과 반응형 화면을 구현합니다.", 90, ["html"], 80, 90),
  defineSkill("frontend", "programming-basics", "프로그래밍 기초", "변수, 조건문, 반복문과 함수를 익힙니다.", 30, [], 80, 520),
  defineSkill("frontend", "javascript", "JavaScript", "브라우저 동작과 비동기 프로그래밍을 배웁니다.", 50, ["programming-basics"], 80, 680),
  defineSkill("frontend", "typescript", "TypeScript", "정적 타입으로 JavaScript의 안정성을 높입니다.", 120, ["javascript"], 250, 760),
  defineSkill("frontend", "react", "React", "컴포넌트와 상태를 이용해 UI를 구현합니다.", 60, ["typescript", "css"], 430, 760),
  defineSkill("frontend", "nextjs", "Next.js", "라우팅과 서버 렌더링이 포함된 웹 서비스를 만듭니다.", 70, ["react"], 610, 700),
  defineSkill("frontend", "rest-api", "REST API", "HTTP 요청과 응답 구조를 이해합니다.", 50, [], 650, 120),
  defineSkill("frontend", "api-integration", "API 연동", "서버 데이터를 화면과 연결하고 오류를 처리합니다.", 130, ["rest-api", "javascript"], 750, 260),
  defineSkill("frontend", "git", "Git", "버전 관리와 협업 흐름을 익힙니다.", 30, [], 720, 450),
  defineSkill("frontend", "web-performance", "웹 성능 최적화", "로딩과 렌더링 성능을 개선합니다.", 200, ["nextjs", "api-integration"], 850, 820),

  // Full Stack Developer
  defineSkill("fullstack", "html-css", "HTML·CSS", "웹 화면의 구조와 스타일을 구현합니다.", 40, [], 860, 60),
  defineSkill("fullstack", "javascript", "JavaScript", "프론트와 서버에서 사용하는 JavaScript를 익힙니다.", 50, [], 1060, 60),
  defineSkill("fullstack", "react", "React", "컴포넌트 기반 프론트엔드를 구현합니다.", 60, ["html-css", "javascript"], 960, 240),
  defineSkill("fullstack", "nextjs", "Next.js", "풀스택 React 애플리케이션의 기반을 만듭니다.", 70, ["react"], 920, 430),
  defineSkill("fullstack", "java", "Java", "서버 개발에 필요한 Java 문법을 학습합니다.", 50, [], 1470, 30),
  defineSkill("fullstack", "spring-boot", "Spring Boot", "Java 기반 API 서버를 구현합니다.", 70, ["java"], 1700, 170),
  defineSkill("fullstack", "rest-api", "REST API", "프론트와 백엔드 사이의 API 계약을 설계합니다.", 50, [], 1540, 510),
  defineSkill("fullstack", "sql", "SQL", "서비스 데이터 조회와 변경 쿼리를 작성합니다.", 40, [], 1400, 690),
  defineSkill("fullstack", "database", "Database", "테이블 관계와 트랜잭션을 이해합니다.", 50, ["sql"], 1580, 730),
  defineSkill("fullstack", "authentication", "인증·인가", "로그인과 사용자 권한을 구현합니다.", 70, ["spring-boot", "rest-api"], 1720, 390),
  defineSkill("fullstack", "frontend-backend-integration", "프론트·백 연동", "API를 기준으로 화면과 서버를 연결합니다.", 70, ["nextjs", "rest-api"], 1130, 610),
  defineSkill("fullstack", "fullstack-project", "풀스택 프로젝트", "프론트, 서버와 DB를 하나의 서비스로 완성합니다.", 110, ["frontend-backend-integration", "database", "authentication"], 1320, 520),
  defineSkill("fullstack", "git", "Git", "브랜치와 Pull Request 협업을 익힙니다.", 30, [], 1270, 20),
  defineSkill("fullstack", "docker", "Docker", "완성한 서비스를 컨테이너로 실행합니다.", 60, ["fullstack-project"], 1460, 230),
  defineSkill("fullstack", "e2e-testing", "E2E 테스트", "사용자의 전체 동작 흐름을 자동으로 검증합니다.", 80, ["fullstack-project"], 1190, 800),

  // Backend Developer
  defineSkill("backend", "programming-basics", "프로그래밍 기초", "서버 개발에 필요한 기본 문법과 문제 해결력을 익힙니다.", 30, [], 1740, 220),
  defineSkill("backend", "java", "Java", "Java 문법, 컬렉션과 예외 처리를 학습합니다.", 50, ["programming-basics"], 1940, 50),
  defineSkill("backend", "oop", "객체지향", "캡슐화, 상속, 다형성과 객체 설계를 익힙니다.", 70, ["java"], 2110, 40),
  defineSkill("backend", "spring-boot", "Spring Boot", "계층형 Java 웹 애플리케이션을 구현합니다.", 70, ["oop"], 2280, 90),
  defineSkill("backend", "rest-api", "REST API", "HTTP 기반 서버 API를 설계하고 구현합니다.", 50, ["spring-boot"], 2390, 250),
  defineSkill("backend", "authentication", "인증·인가", "세션과 토큰 기반 사용자 권한을 처리합니다.", 70, ["rest-api"], 2420, 410),
  defineSkill("backend", "sql", "SQL", "데이터 조회, 결합과 집계 쿼리를 작성합니다.", 40, [], 1740, 650),
  defineSkill("backend", "database", "Database", "인덱스와 트랜잭션을 포함한 DB 기초를 익힙니다.", 50, ["sql"], 1960, 800),
  defineSkill("backend", "data-modeling", "데이터 모델링", "요구사항을 테이블과 관계로 설계합니다.", 90, ["database"], 2150, 930),
  defineSkill("backend", "redis", "Redis", "캐시를 이용해 조회 성능을 높입니다.", 100, ["database", "spring-boot"], 2280, 740),
  defineSkill("backend", "linux", "Linux", "서버 명령어, 권한과 프로세스를 다룹니다.", 60, [], 2380, 600),
  defineSkill("backend", "docker", "Docker", "서버 애플리케이션을 컨테이너화합니다.", 60, ["linux"], 2450, 760),
  defineSkill("backend", "aws", "AWS", "클라우드에 서버와 데이터베이스를 배포합니다.", 130, ["docker"], 2450, 900),
  defineSkill("backend", "git", "Git", "코드 변경 이력과 협업 브랜치를 관리합니다.", 30, [], 1830, 520),

  // Data Analyst
  defineSkill("data-analyst", "python", "Python", "데이터 처리에 필요한 Python 문법을 익힙니다.", 40, [], 280, 1120),
  defineSkill("data-analyst", "pandas", "Pandas", "표 데이터를 불러오고 변환하며 집계합니다.", 50, ["python"], 110, 1030),
  defineSkill("data-analyst", "sql", "SQL", "분석에 필요한 데이터를 직접 추출합니다.", 40, [], 260, 1450),
  defineSkill("data-analyst", "database", "Database", "테이블 구조와 데이터 관계를 이해합니다.", 50, ["sql"], 40, 1600),
  defineSkill("data-analyst", "statistics", "통계", "분포, 추정과 가설검정의 기초를 학습합니다.", 50, [], 560, 1650),
  defineSkill("data-analyst", "eda", "데이터 정제·EDA", "결측치와 이상치를 처리하고 특징을 탐색합니다.", 140, ["pandas", "statistics"], 360, 1650),
  defineSkill("data-analyst", "data-visualization", "데이터 시각화", "차트로 데이터의 의미를 전달합니다.", 150, ["eda"], 760, 1640),
  defineSkill("data-analyst", "bi-tools", "Tableau·Power BI", "지표와 대시보드를 제작합니다.", 160, ["data-visualization", "sql"], 940, 1530),
  defineSkill("data-analyst", "ab-testing", "A/B Testing", "실험을 설계하고 결과의 유의성을 판단합니다.", 190, ["statistics"], 970, 1290),
  defineSkill("data-analyst", "git", "Git", "분석 코드와 문서의 버전을 관리합니다.", 30, [], 720, 1110),

  // Data Scientist
  defineSkill("data-scientist", "python", "Python", "모델링에 필요한 Python 프로그래밍을 익힙니다.", 40, [], 1320, 1110),
  defineSkill("data-scientist", "pandas", "Pandas", "학습 데이터를 정리하고 변환합니다.", 50, ["python"], 1100, 980),
  defineSkill("data-scientist", "statistics", "통계", "확률, 추정과 통계적 모델의 기반을 배웁니다.", 50, [], 1490, 1650),
  defineSkill("data-scientist", "linear-algebra", "선형대수", "벡터와 행렬로 모델의 수학적 기반을 익힙니다.", 70, ["statistics"], 1670, 1720),
  defineSkill("data-scientist", "scikit-learn", "Scikit-learn", "전처리와 학습 파이프라인을 구현합니다.", 90, ["python", "linear-algebra"], 1850, 1690),
  defineSkill("data-scientist", "feature-engineering", "Feature Engineering", "학습에 유용한 특성을 선택하고 생성합니다.", 90, ["pandas", "statistics"], 1190, 1450),
  defineSkill("data-scientist", "machine-learning", "Machine Learning", "지도·비지도 학습 모델을 훈련합니다.", 110, ["scikit-learn", "feature-engineering"], 2030, 1570),
  defineSkill("data-scientist", "model-evaluation", "모델 평가", "적절한 지표와 검증 방법으로 모델을 평가합니다.", 90, ["machine-learning"], 2190, 1430),
  defineSkill("data-scientist", "time-series", "Time Series", "시간 순서가 있는 데이터를 예측합니다.", 100, ["machine-learning"], 2290, 1730),
  defineSkill("data-scientist", "deep-learning", "Deep Learning", "신경망 기반 모델의 구조와 학습을 이해합니다.", 140, ["machine-learning", "linear-algebra"], 2350, 1550),
  defineSkill("data-scientist", "sql", "SQL", "모델 학습에 필요한 데이터를 조회합니다.", 40, [], 2060, 1080),
  defineSkill("data-scientist", "git", "Git", "실험 코드와 모델 변경 이력을 관리합니다.", 30, [], 1770, 1070),
];
