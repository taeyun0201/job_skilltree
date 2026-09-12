import { JOBS, SKILLS } from "@/data/skill-map";
import type { Skill } from "@/types";

const STATUS_LABEL = {
  completed: "해금 완료",
  available: "학습 가능",
  locked: "잠김",
} as const;

interface SkillDetailProps {
  skill: Skill | null;
  onClose: () => void;
  onUnlock: (skill: Skill) => void;
  isUnlocking: boolean;
  error: string | null;
}

export function SkillDetail({ skill, onClose, onUnlock, isUnlocking, error }: SkillDetailProps) {
  if (!skill) return null;

  const prerequisiteNames = skill.prerequisiteIds.map(
    (id) => SKILLS.find((item) => item.id === id)?.name ?? id,
  );
  const jobNames = JOBS.filter((job) =>
    SKILLS.some(
      (item) => item.skillKey === skill.skillKey && item.jobIds.includes(job.id),
    ),
  ).map((job) => job.name);

  return (
    <aside className={"pixel-detail-panel " + skill.status}>
      <button className="pixel-detail-close" type="button" onClick={onClose} aria-label="닫기">
        ×
      </button>
      <span className="pixel-detail-status">{STATUS_LABEL[skill.status]}</span>
      <h2>{skill.name}</h2>
      <p>{skill.description}</p>

      <dl className="pixel-detail-list">
        <div>
          <dt>획득 경험치</dt>
          <dd>{skill.xp} XP</dd>
        </div>
        <div>
          <dt>이 스킬을 사용하는 직업</dt>
          <dd>{jobNames.join(" · ")}</dd>
        </div>
        <div>
          <dt>필요 스킬</dt>
          <dd>{prerequisiteNames.length ? prerequisiteNames.join(" · ") : "없음"}</dd>
        </div>
      </dl>

      {error ? <p role="alert">{error}</p> : null}
      <button
        className="pixel-detail-action"
        type="button"
        disabled={skill.status !== "available" || isUnlocking}
        onClick={() => onUnlock(skill)}
      >
        {skill.status === "completed"
          ? "해금 완료"
          : skill.status === "locked"
            ? "선행 스킬 필요"
            : isUnlocking
              ? "해금 중..."
              : `해금하기 (+${skill.xp} XP)`}
      </button>
    </aside>
  );
}
