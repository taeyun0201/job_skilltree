import Link from "next/link";

interface SkillSummaryProps {
  completed: number; totalSkills: number; targetJob: string;
  targetCompleted: number; targetTotal: number; major: string; interest: string; age?: number;
  nextSkills: { name: string; xp: number }[];
  recentSkills: { name: string; unlockedAt: Date }[];
}

export function SkillSummary(props: SkillSummaryProps) {
  const targetProgress = props.targetTotal ? Math.round((props.targetCompleted / props.targetTotal) * 100) : 0;
  return (
    <section className="dashboard-info">
      <div className="card profile-summary">
        <div className="dashboard-card-heading"><div><p className="eyebrow">ADVENTURER PROFILE</p><h2>모험가 정보</h2></div><span className="job-badge">{props.targetJob}</span></div>
        <dl className="profile-grid">
          <div><dt>전공</dt><dd>{props.major || "미입력"}</dd></div><div><dt>관심 분야</dt><dd>{props.interest || "미입력"}</dd></div>
          <div><dt>나이</dt><dd>{props.age ? `${props.age}세` : "미입력"}</dd></div><div><dt>전체 해금</dt><dd>{props.completed} / {props.totalSkills}</dd></div>
        </dl>
      </div>
      <div className="card career-progress-card">
        <div className="dashboard-card-heading"><div><p className="eyebrow">CAREER PROGRESS</p><h2>{props.targetJob}</h2></div><strong className="progress-percent">{targetProgress}%</strong></div>
        <p>{props.targetCompleted} / {props.targetTotal} 스킬 해금</p>
        <div className="progress career-progress"><span style={{ width: `${targetProgress}%` }} /></div>
        <Link className="button primary dashboard-map-link" href="/skill-map">스킬트리로 이동 →</Link>
      </div>
      <div className="dashboard-list-grid">
        <section className="card dashboard-list-card"><p className="eyebrow">NEXT QUEST</p><h2>다음 추천 스킬</h2>
          {props.nextSkills.length ? <ul>{props.nextSkills.map((skill) => <li key={skill.name}><span>{skill.name}</span><strong>+{skill.xp} XP</strong></li>)}</ul> : <p>목표 직업의 모든 스킬을 완료했어요!</p>}
        </section>
        <section className="card dashboard-list-card"><p className="eyebrow">RECENT ADVANCEMENTS</p><h2>최근 해금</h2>
          {props.recentSkills.length ? <ul>{props.recentSkills.map((skill) => <li key={`${skill.name}-${skill.unlockedAt.toISOString()}`}><span>✓ {skill.name}</span><time>{skill.unlockedAt.toLocaleDateString("ko-KR")}</time></li>)}</ul> : <p>스킬트리에서 첫 스킬을 해금해보세요.</p>}
        </section>
      </div>
    </section>
  );
}
