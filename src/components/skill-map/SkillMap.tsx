"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from "react";
import { JOBS, SKILLS } from "@/data/skill-map";
import type { Skill, SkillStatus } from "@/types";
import { SkillDetail } from "./SkillDetail";

const WORLD_WIDTH = 3800;
const WORLD_HEIGHT = 2600;
const NODE_WIDTH = 146;
const NODE_HEIGHT = 92;
const CAREER_WIDTH = 240;
const CAREER_HEIGHT = 112;
const MIN_SCALE = 0.22;
const MAX_SCALE = 1.35;

const SKILL_ICONS: Record<string, string> = {
  git: "⑂",
  "programming-basics": "⌨",
  "data-structures": "⌘",
  linux: "🐧",
  docker: "▣",
  "ci-cd": "↻",
  aws: "☁",
  "rest-api": "⇄",
  html: "</>",
  css: "#",
  javascript: "JS",
  typescript: "TS",
  react: "⚛",
  nextjs: "N",
  "api-integration": "⇆",
  "web-performance": "⚡",
  java: "J",
  oop: "◇",
  "spring-boot": "♨",
  authentication: "◆",
  sql: "SQL",
  database: "DB",
  "data-modeling": "▦",
  redis: "R",
  "fullstack-project": "★",
  "frontend-backend-integration": "⛓",
  "e2e-testing": "✓",
  python: "PY",
  pandas: "PD",
  statistics: "Σ",
  eda: "⌕",
  "data-visualization": "▥",
  "bi-tools": "BI",
  "ab-testing": "A/B",
  "linear-algebra": "ƒ",
  "scikit-learn": "SK",
  "feature-engineering": "⚙",
  "machine-learning": "ML",
  "model-evaluation": "◎",
  "time-series": "⌁",
  "deep-learning": "DL",
};

function connectionColor(status: SkillStatus) {
  if (status === "completed") return "#f4c542";
  if (status === "available") return "#46e6e6";
  return "#657083";
}

interface SkillMapProps {
  initialUnlockedSkillKeys: string[];
  targetJobId?: string;
}

export function SkillMap({ initialUnlockedSkillKeys, targetJobId }: SkillMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unlockedSkillKeys, setUnlockedSkillKeys] = useState(
    () => new Set(initialUnlockedSkillKeys),
  );
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(targetJobId ?? null);
  const [scale, setScale] = useState(0.27);
  const [offset, setOffset] = useState({ x: 18, y: 34 });
  const [isDragging, setIsDragging] = useState(false);
  const [animateMap, setAnimateMap] = useState(false);

  const displayedSkills = useMemo(() => {
    const sourceById = new Map(SKILLS.map((skill) => [skill.id, skill]));
    return SKILLS.map((skill): Skill => {
      if (unlockedSkillKeys.has(skill.skillKey)) return { ...skill, status: "completed" };
      const available = skill.prerequisiteIds.every((id) => {
        const prerequisite = sourceById.get(id);
        return prerequisite ? unlockedSkillKeys.has(prerequisite.skillKey) : false;
      });
      return { ...skill, status: available ? "available" : "locked" };
    });
  }, [unlockedSkillKeys]);
  const skillsById = useMemo(
    () => new Map(displayedSkills.map((skill) => [skill.id, skill])),
    [displayedSkills],
  );
  const selected = displayedSkills.find((skill) => skill.id === selectedId) ?? null;
  const uniqueSkillCount = new Set(SKILLS.map((skill) => skill.skillKey)).size;
  const completedCount = new Set(
    displayedSkills.filter((skill) => skill.status === "completed").map((skill) => skill.skillKey),
  ).size;

  async function unlockSkill(skill: Skill) {
    setIsUnlocking(true);
    setUnlockError(null);
    try {
      const response = await fetch(`/api/skills/${encodeURIComponent(skill.id)}/unlock`, {
        method: "POST",
      });
      const result = (await response.json()) as { message?: string; skillKey?: string };
      if (!response.ok || !result.skillKey) {
        throw new Error(result.message ?? "스킬을 해금하지 못했습니다.");
      }
      setUnlockedSkillKeys((current) => new Set(current).add(result.skillKey as string));
    } catch (error) {
      setUnlockError(error instanceof Error ? error.message : "스킬을 해금하지 못했습니다.");
    } finally {
      setIsUnlocking(false);
    }
  }

  function focusJob(jobId: string) {
    const job = JOBS.find((item) => item.id === jobId);
    const viewport = viewportRef.current;
    if (!job || !viewport) return;

    setAnimateMap(true);
    setActiveJobId(jobId);
    const nextScale = 0.72;
    setScale(nextScale);
    setOffset({
      x: viewport.clientWidth / 2 - (job.position.x + CAREER_WIDTH / 2) * nextScale,
      y: viewport.clientHeight / 2 - (job.position.y + CAREER_HEIGHT / 2) * nextScale,
    });
  }

  function resetView() {
    setAnimateMap(true);
    setScale(0.27);
    setOffset({ x: 18, y: 34 });
    setSelectedId(null);
    setActiveJobId(null);
  }

  useEffect(() => {
    if (!targetJobId) return;
    const frame = requestAnimationFrame(() => focusJob(targetJobId));
    return () => cancelAnimationFrame(frame);
  }, [targetJobId]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setAnimateMap(false);
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.offsetX + event.clientX - drag.pointerX,
      y: drag.offsetY + event.clientY - drag.pointerY,
    });
  }

  function stopDragging(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setAnimateMap(false);
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale * (event.deltaY > 0 ? 0.9 : 1.1)),
    );
    const ratio = nextScale / scale;

    setOffset({
      x: pointerX - (pointerX - offset.x) * ratio,
      y: pointerY - (pointerY - offset.y) * ratio,
    });
    setScale(nextScale);
  }

  function changeZoom(amount: number) {
    setAnimateMap(true);
    setScale((current) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + amount)));
  }

  return (
    <section className="skill-map-shell">
      <div className="pixel-map-header">
        <div>
          <span className="pixel-kicker">CAREER ADVANCEMENTS</span>
          <h1>커리어 스킬트리</h1>
        </div>
        <div className="pixel-progress-wrap">
          <div className="pixel-progress-track">
            <span style={{ width: (completedCount / uniqueSkillCount) * 100 + "%" }} />
          </div>
          <strong>{completedCount} / {uniqueSkillCount} 해금</strong>
        </div>
      </div>

      <div className="pixel-job-tabs" aria-label="직업으로 이동">
        {JOBS.map((job) => (
          <button
            className={activeJobId === job.id ? "active" : undefined}
            key={job.id}
            type="button"
            onClick={() => focusJob(job.id)}
          >
            <span style={{ background: job.themeColor }} />
            {job.name}
          </button>
        ))}
      </div>

      <div
        ref={viewportRef}
        className={"skill-map-viewport" + (isDragging ? " dragging" : "")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onWheel={handleWheel}
      >
        <div
          className={"skill-map-world" + (animateMap ? " animated" : "")}
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: "translate(" + offset.x + "px, " + offset.y + "px) scale(" + scale + ")",
          }}
        >
          <svg
            className="skill-connections"
            width={WORLD_WIDTH}
            height={WORLD_HEIGHT}
            viewBox={"0 0 " + WORLD_WIDTH + " " + WORLD_HEIGHT}
            aria-hidden="true"
          >
            {displayedSkills.filter((skill) => skill.prerequisiteIds.length === 0).map((skill) => {
              const job = JOBS.find((item) => item.id === skill.jobIds[0]);
              if (!job) return null;

              const startX = job.position.x + CAREER_WIDTH / 2;
              const startY = job.position.y + CAREER_HEIGHT / 2;
              const endX = skill.position.x + NODE_WIDTH / 2;
              const endY = skill.position.y + NODE_HEIGHT / 2;

              return (
                <path
                  key={job.id + "-root-" + skill.id}
                  d={"M " + startX + " " + startY + " L " + endX + " " + endY}
                  stroke={connectionColor(skill.status)}
                  className={"skill-connection root " + skill.status}
                />
              );
            })}
            {displayedSkills.flatMap((skill) =>
              skill.prerequisiteIds.map((prerequisiteId) => {
                const source = skillsById.get(prerequisiteId);
                if (!source) return null;
                const startX = source.position.x + NODE_WIDTH / 2;
                const startY = source.position.y + NODE_HEIGHT / 2;
                const endX = skill.position.x + NODE_WIDTH / 2;
                const endY = skill.position.y + NODE_HEIGHT / 2;
                const path = "M " + startX + " " + startY + " L " + endX + " " + endY;

                return (
                  <path
                    key={prerequisiteId + "-" + skill.id}
                    d={path}
                    stroke={connectionColor(skill.status)}
                    className={"skill-connection " + skill.status}
                  />
                );
              }),
            )}
          </svg>

          {JOBS.map((job) => (
            <button
              key={job.id}
              className={"career-plaque" + (activeJobId === job.id ? " active" : "")}
              type="button"
              style={{
                left: job.position.x,
                top: job.position.y,
                borderColor: job.themeColor,
              }}
              onClick={() => focusJob(job.id)}
            >
              <span className="career-plaque-icon">⚔</span>
              <strong>{job.name}</strong>
              <small>{job.description}</small>
            </button>
          ))}

          {displayedSkills.map((skill) => (
            <button
              className={"pixel-skill-node " + skill.status}
              key={skill.id}
              type="button"
              onClick={() => {
                setSelectedId(skill.id);
                setUnlockError(null);
              }}
              style={{ left: skill.position.x, top: skill.position.y }}
              aria-label={skill.name + " - " + skill.status}
            >
              <span className="pixel-node-lock" aria-hidden="true">
                {skill.status === "locked" ? "▣" : ""}
              </span>
              <span className="pixel-node-icon" aria-hidden="true">
                {SKILL_ICONS[skill.skillKey] ?? "◆"}
              </span>
              <strong>{skill.name}</strong>
              <small>{skill.xp} XP</small>
            </button>
          ))}
        </div>

        <div className="map-controls">
          <button type="button" onClick={() => changeZoom(0.1)} aria-label="확대">+</button>
          <button type="button" onClick={() => changeZoom(-0.1)} aria-label="축소">−</button>
          <button type="button" onClick={resetView} aria-label="전체 지도 보기">⌂</button>
        </div>

        <div className="pixel-legend">
          <span><i className="completed" />해금 완료</span>
          <span><i className="available" />학습 가능</span>
          <span><i className="locked" />잠김</span>
        </div>

        <div className="map-help">드래그하여 이동 · 휠로 확대/축소</div>
        <SkillDetail
          skill={selected}
          onClose={() => setSelectedId(null)}
          onUnlock={unlockSkill}
          isUnlocking={isUnlocking}
          error={unlockError}
        />
      </div>
    </section>
  );
}
