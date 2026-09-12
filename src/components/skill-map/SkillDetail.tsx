import type { Skill } from "@/types";

export function SkillDetail({ skill }: { skill: Skill | null }) {
  if (!skill) return <aside className="card"><p>스킬을 선택하세요.</p></aside>;

  return (
    <aside className="card">
      <p className="eyebrow">{skill.status === "completed" ? "해금 완료" : "스킬"}</p>
      <h2>{skill.name}</h2>
      <p>{skill.description}</p>
      <p>획득 경험치: {skill.xp} XP</p>
      <button className="button primary" disabled={skill.status !== "available"}>학습 완료 및 해금</button>
    </aside>
  );
}
