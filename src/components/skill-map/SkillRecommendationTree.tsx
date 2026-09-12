"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JOBS, SKILLS } from "@/data/skill-map";
import type { Skill } from "@/types";

const NODE_WIDTH = 132;
const NODE_HEIGHT = 68;
const WORLD_WIDTH = 1160;
const WORLD_HEIGHT = 1810;
const GRAPH_HEIGHT = 1510;
const LANES = [
  { title: "WEB UI", keys: ["html", "css", "html-css", "react", "nextjs", "web-performance"] },
  { title: "WEB LOGIC", keys: ["programming-basics", "javascript", "typescript", "rest-api", "api-integration", "frontend-backend-integration"] },
  { title: "SERVER", keys: ["java", "oop", "spring-boot", "authentication", "fullstack-project", "e2e-testing"] },
  { title: "DATA", keys: ["sql", "database", "data-modeling", "eda", "data-visualization", "bi-tools"] },
  { title: "AI · ML", keys: ["python", "pandas", "feature-engineering", "machine-learning", "model-evaluation", "time-series", "deep-learning"] },
  { title: "FOUNDATION", keys: ["git", "statistics", "linear-algebra", "scikit-learn", "ab-testing", "linux", "docker", "aws", "redis"] },
];

const EDGES: [string, string][] = [
  ["html", "css"], ["css", "html-css"], ["html-css", "react"], ["react", "nextjs"], ["nextjs", "web-performance"],
  ["programming-basics", "javascript"], ["javascript", "typescript"], ["typescript", "rest-api"],
  ["rest-api", "api-integration"], ["api-integration", "frontend-backend-integration"],
  ["java", "oop"], ["oop", "spring-boot"], ["spring-boot", "authentication"],
  ["frontend-backend-integration", "fullstack-project"], ["fullstack-project", "e2e-testing"],
  ["sql", "database"], ["database", "data-modeling"], ["data-modeling", "eda"],
  ["eda", "data-visualization"], ["data-visualization", "bi-tools"],
  ["python", "pandas"], ["pandas", "feature-engineering"], ["feature-engineering", "machine-learning"],
  ["machine-learning", "model-evaluation"], ["machine-learning", "time-series"], ["machine-learning", "deep-learning"],
  ["git", "statistics"], ["statistics", "linear-algebra"], ["linear-algebra", "scikit-learn"],
  ["scikit-learn", "ab-testing"], ["linux", "docker"], ["docker", "aws"], ["aws", "redis"],
];

interface Props { skills: Skill[]; onSelect: (skill: Skill) => void; }

export function SkillRecommendationTree({ skills, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const fitToWidth = useCallback(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    setScale(Math.min(1, Math.max(0.35, (viewport.clientWidth - 24) / WORLD_WIDTH)));
    viewport.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fitToWidth();
    const viewport = scrollRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(fitToWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fitToWidth]);

  const canonical = new Map<string, Skill>();
  for (const skill of skills) {
    const current = canonical.get(skill.skillKey);
    if (!current || skill.status === "completed" || (skill.status === "available" && current.status === "locked")) canonical.set(skill.skillKey, skill);
  }
  const positions = new Map<string, { x: number; y: number }>();
  LANES.forEach((lane, laneIndex) => {
    lane.keys.forEach((key, rowIndex) => positions.set(key, { x: 35 + laneIndex * 188, y: 150 + rowIndex * 155 }));
  });
  const scores = JOBS.map((job) => {
    const jobKeys = new Set(SKILLS.filter((skill) => skill.jobIds.includes(job.id)).map((skill) => skill.skillKey));
    const learned = [...jobKeys].reduce((sum, key) => sum + (canonical.get(key)?.status === "completed" ? (canonical.get(key)?.xp ?? 0) : 0), 0);
    return { job, score: learned + 10 };
  });
  const scoreTotal = scores.reduce((sum, item) => sum + item.score, 0);
  const probabilities = new Map(scores.map(({ job, score }) => [job.id, Math.round(score / scoreTotal * 100)]));
  const incoming = new Set(EDGES.map(([, target]) => target));

  return (
    <div className="recommendation-tree">
      <aside className="recommendation-panel">
        <p className="pixel-kicker">LIVE CAREER MATCH</p><h2>직업 추천 확률</h2><p>해금한 기술을 기준으로 실시간 계산됩니다.</p>
        <div className="recommendation-bars">
          {[...scores].sort((a, b) => (probabilities.get(b.job.id) ?? 0) - (probabilities.get(a.job.id) ?? 0)).map(({ job }, index) => {
            const probability = probabilities.get(job.id) ?? 0;
            return <div className={index === 0 ? "top" : ""} key={job.id}><span><strong>{index + 1}. {job.name}</strong><b>{probability}%</b></span><i><em style={{ width: `${probability}%`, background: job.themeColor }} /></i></div>;
          })}
        </div>
      </aside>
      <div className="discovery-map-scroll" ref={scrollRef}>
        <div className="discovery-map-canvas" style={{ width: WORLD_WIDTH * scale, height: WORLD_HEIGHT * scale }}>
        <div className="discovery-map-world" style={{ width: WORLD_WIDTH, height: WORLD_HEIGHT, transform: `scale(${scale})` }}>
          <svg width={WORLD_WIDTH} height={GRAPH_HEIGHT} viewBox={`0 0 ${WORLD_WIDTH} ${GRAPH_HEIGHT}`} aria-hidden="true">
            {[...positions].filter(([key]) => !incoming.has(key)).map(([key, target]) => <path key={`start-${key}`} d={`M ${WORLD_WIDTH / 2} 66 L ${target.x + NODE_WIDTH / 2} ${target.y}`} className={`discovery-edge ${canonical.get(key)?.status ?? "locked"}`} />)}
            {EDGES.map(([sourceKey, targetKey]) => {
              const source = positions.get(sourceKey); const target = positions.get(targetKey); if (!source || !target) return null;
              const status = canonical.get(sourceKey)?.status === "completed" && canonical.get(targetKey)?.status === "completed" ? "completed" : canonical.get(targetKey)?.status ?? "locked";
              return <path key={`${sourceKey}-${targetKey}`} d={`M ${source.x + NODE_WIDTH / 2} ${source.y + NODE_HEIGHT} C ${source.x + NODE_WIDTH / 2} ${source.y + 135}, ${target.x + NODE_WIDTH / 2} ${target.y - 65}, ${target.x + NODE_WIDTH / 2} ${target.y}`} className={`discovery-edge ${status}`} />;
            })}
          </svg>
          <div className="discovery-start">START<small>기초 기술부터 시작</small></div>
          {LANES.map((lane, index) => <div className="discovery-lane" key={lane.title} style={{ left: 20 + index * 188 }}><strong>{lane.title}</strong></div>)}
          {[...positions].map(([key, position]) => { const skill = canonical.get(key); if (!skill) return null; return <button key={key} type="button" className={`discovery-node ${skill.status}`} style={{ left: position.x, top: position.y }} onClick={() => onSelect(skill)}><span>{skill.status === "completed" ? "✓" : skill.status === "available" ? "◆" : "▣"}</span><strong>{skill.name}</strong><small>{skill.xp} XP</small></button>; })}
          <div className="discovery-job-zone"><span>CAREER RECOMMENDATIONS</span></div>
          {JOBS.map((job, index) => <div className="discovery-job" key={job.id} style={{ left: 25 + index * 225, top: 1600, borderColor: job.themeColor }}><small>추천 확률</small><strong>{job.name}</strong><b>{probabilities.get(job.id) ?? 0}%</b></div>)}
        </div>
        </div>
      </div>
    </div>
  );
}
