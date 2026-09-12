export interface JobPosting {
  id: string;
  jobId: string;
  sourceJobName: string;
  company: string;
  title: string;
  experience: string;
  location: string;
  skills: string[];
  deadline: string;
  site: string;
  url: string;
}

export const JOB_POSTINGS: JobPosting[] = [
  ["310318", "backend", "백엔드 개발자", "에이티씨아이", "백엔드 엔지니어 (Python + Go)", "신입~경력 6년", "서울 강남구", "Python, FastAPI, Django REST Framework, Go, Gin, PostgreSQL, Git, CI/CD", "상시채용"],
  ["373483", "frontend", "프론트엔드 개발자", "유모스원", "Frontend Engineer (WMS)", "경력 5년+", "서울 서초구", "React, TypeScript, Redux/Recoil/Zustand, HTML5, CSS3, Git, CI/CD", "상시채용"],
  ["375034", "frontend", "프론트엔드 개발자", "위버스마인드", "Frontend Engineer 3년 이상", "경력 3년+", "서울 구로구", "React, JavaScript, TypeScript, HTML5, CSS3, REST API, Git", "상시채용"],
  ["377798", "frontend", "프론트엔드 개발자", "로앤컴퍼니", "FDE팀 Frontend Engineer", "경력 3년+", "서울 서초구", "React, JavaScript, TypeScript, REST API, Git, Kubernetes", "상시채용"],
  ["375692", "frontend", "프론트엔드 개발자", "일레븐", "Growth Frontend Engineer", "경력 3년+", "경기 용인시", "React/Next.js, TypeScript, A/B Test, Web Vitals, i18n", "상시채용"],
  ["384561", "frontend", "프론트엔드 개발자", "미소(miso)", "Front-end Engineer", "경력 3년+", "서울 종로구", "React Native, React, Next.js, TypeScript, 데이터 트래킹", "상시채용"],
  ["364864", "frontend", "프론트엔드 개발자", "카카오헬스케어", "[계약직][AI Native EHR] Front-End Engineer", "경력 5년+", "경기 성남시", "React, TypeScript, HTML5, CSS3, Design System, Module Federation", "상시채용"],
  ["381079", "frontend", "프론트엔드 개발자", "콕스웨이브", "[AX krewa] 소프트웨어 엔지니어 (Frontend)", "경력 3년+", "대한민국", "React, TypeScript, SSE/WebSocket, AI Coding Assistant", "공고 확인"],
  ["348786", "backend", "DevOps 엔지니어", "시어스랩", "DevOps Engineer 2년 이상", "경력 2~7년", "서울 강남구", "AWS, EKS, Kubernetes, Terraform, Jenkins, ArgoCD, Prometheus, Grafana", "상시채용"],
  ["341292", "data-scientist", "AI 소프트웨어 엔지니어", "노타(Nota)", "[인턴] [Solution] AI Software Engineer", "인턴/정규직전환형", "서울 강남구", "Python, Linux, PyTorch, ONNX, TensorRT, vLLM, CV/VLM, GitHub", "상시채용"],
  ["373164", "fullstack", "프론트+백엔드 개발자", "래브라도랩스", "솔루션 백엔드 개발(계약직)", "경력 8~10년", "서울 서초구", "Java, Spring Boot, React, TypeScript, Next.js, MySQL, Redis, Docker", "공고 확인"],
  ["367558", "frontend", "프론트엔드 개발자", "로민", "프론트엔드 엔지니어", "경력 3년+", "서울 서초구", "HTML5, CSS3, TypeScript, JavaScript, Vue.js, React.js, AWS, Docker, Git", "공고 확인"],
].map(([id, jobId, sourceJobName, company, title, experience, location, skillText, deadline]) => ({
  id: `wanted-${id}`,
  jobId,
  sourceJobName,
  company,
  title,
  experience,
  location,
  skills: skillText.split(", "),
  deadline,
  site: "원티드",
  url: `https://recruit.wanted.co.kr/wd/${id}`,
}));
