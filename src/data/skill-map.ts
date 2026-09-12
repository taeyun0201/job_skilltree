import type { Job, Skill } from "@/types";

export const JOBS: Job[] = [
  { id: "frontend", name: "프론트엔드 개발자", description: "웹 화면과 사용자 경험을 구현합니다." },
  { id: "backend", name: "백엔드 개발자", description: "서버, API, 데이터를 구현합니다." },
];

export const SKILLS: Skill[] = [
  { id: "html-css", name: "HTML/CSS", description: "웹 문서의 구조와 스타일 기초", xp: 50, jobIds: ["frontend"], prerequisiteIds: [], position: { x: 30, y: 190 }, status: "completed" },
  { id: "javascript", name: "JavaScript", description: "웹 프로그래밍 언어의 핵심 문법", xp: 50, jobIds: ["frontend", "backend"], prerequisiteIds: [], position: { x: 180, y: 90 }, status: "available" },
  { id: "react", name: "React", description: "컴포넌트 기반 UI 개발", xp: 50, jobIds: ["frontend"], prerequisiteIds: ["javascript"], position: { x: 330, y: 25 }, status: "locked" },
  { id: "node", name: "Node.js", description: "JavaScript 서버 개발", xp: 50, jobIds: ["backend"], prerequisiteIds: ["javascript"], position: { x: 330, y: 170 }, status: "locked" },
  { id: "git", name: "Git", description: "버전 관리와 팀 협업", xp: 50, jobIds: ["frontend", "backend"], prerequisiteIds: [], position: { x: 180, y: 290 }, status: "available" },
];
