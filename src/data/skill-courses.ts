export interface SkillCourse {
  title: string;
  url: string;
}

const HTML_COURSES: SkillCourse[] = [
  {
    title: "코딩애플 HTML/CSS 기초",
    url: "https://codingapple.com/course/html-basics/",
  },
  {
    title: "코드잇 웹 퍼블리싱",
    url: "https://www.codeit.kr/paths/web-publishing",
  },
];

export const SKILL_COURSES: Readonly<Record<string, SkillCourse[]>> = {
  java: [
    {
      title: "인프런 김영한의 실전 자바 기본편",
      url: "https://www.inflearn.com/course/%EA%B9%80%EC%98%81%ED%95%9C%EC%9D%98-%EC%8B%A4%EC%A0%84-%EC%9E%90%EB%B0%94-%EA%B8%B0%EB%B3%B8%ED%8E%B8?cid=332506",
    },
  ],
  python: [
    {
      title: "코드잇 Python 프로그래밍 입문",
      url: "https://www.codeit.kr/paths/intro-to-python-programming",
    },
    {
      title: "프로그래머스 Python 문제풀이",
      url: "https://school.programmers.co.kr/learn/courses/9877/9877-python%EB%AC%B8%EC%A0%9C%ED%92%80%EC%9D%B4-%ED%8C%8C%EC%9D%B4%EC%8D%AC%EC%9D%84-%EB%AC%B4%EA%B8%B0%EB%A1%9C-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B4%91%ED%83%88%EC%9D%84-%EB%A9%B4%ED%95%98%EC%9E%90",
    },
  ],
  sql: [
    {
      title: "코딩애플 SQL과 Database",
      url: "https://codingapple.com/course/sql-and-database/",
    },
    {
      title: "프로그래머스 하루 만에 SQL 초보 탈출",
      url: "https://school.programmers.co.kr/learn/courses/21705/21705-pcsql-%ED%95%98%EB%A3%A8-%EB%A7%8C%EC%97%90-sql-%EC%B4%88%EB%B3%B4-%ED%83%88%EC%B6%9C",
    },
  ],
  database: [
    {
      title: "코딩애플 SQL과 Database",
      url: "https://codingapple.com/course/sql-and-database/",
    },
    {
      title: "인프런 실전 데이터베이스 기본편",
      url: "https://www.inflearn.com/course/%EA%B9%80%EC%98%81%ED%95%9C-%EC%8B%A4%EC%A0%84-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EA%B8%B0%EB%B3%B8%ED%8E%B8?cid=338212",
    },
  ],
  git: [
    {
      title: "노마드 코더 Git & GitHub 입문",
      url: "https://nomadcoders.co/git-for-beginners?gad_source=1&gad_campaignid=23845164396&gbraid=0AAAAACQEcGho-n-Lrb2vZVomzJR98X2hA&gclid=Cj0KCQjwzY7VBhDwARIsAFtPvBSxKb7AoaFOrQwWxO1lhSFZTQ4fJLP_74ciXiu5X5w_Q-fYXm_7zXwaAlPvEALw_wcB",
    },
  ],
  html: HTML_COURSES,
  css: [HTML_COURSES[0]],
  "html-css": HTML_COURSES,
  javascript: [
    {
      title: "코딩애플 JavaScript 입문",
      url: "https://codingapple.com/course/javascript-jquery-ui/",
    },
    {
      title: "코드잇 JavaScript 프로그래밍 입문",
      url: "https://www.codeit.kr/paths/intro-to-programming-in-javascript",
    },
  ],
  react: [
    {
      title: "코딩애플 React 기초",
      url: "https://codingapple.com/course/react-basic/",
    },
  ],
  "deep-learning": [
    {
      title: "코딩애플 Python 딥러닝",
      url: "https://codingapple.com/course/python-deep-learning/",
    },
  ],
  docker: [
    {
      title: "코딩애플 Docker와 컨테이너",
      url: "https://codingapple.com/course/docker-and-container/",
    },
  ],
};
