import Link from "next/link";

interface SkillSummaryProps {
  completed: number; totalSkills: number; targetJob: string;
  targetCompleted: number; targetTotal: number; major: string; interest: string; age?: number;
  nextSkills: { name: string; xp: number }[];
  recentSkills: { name: string; unlockedAt: Date }[];
  otherCareerPaths: { id: string; name: string; completed: number; total: number; themeColor: string }[];
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
      {props.otherCareerPaths.length ? (
        <section className="card career-paths-card">
          <div className="dashboard-card-heading">
            <div><p className="eyebrow">NEW CAREER QUEST</p><h2>새로운 직업에 도전하기</h2></div>
            <span className="career-complete-badge">목표 달성 ✓</span>
          </div>
          <p>완료한 스킬은 다른 직업에서도 그대로 인정돼요.</p>
          <div className="career-path-grid">
            {props.otherCareerPaths.map((job) => {
              const progress = job.total ? Math.round((job.completed / job.total) * 100) : 0;
              return (
                <Link
                  className="career-path-option"
                  href={`/skill-map?job=${job.id}`}
                  key={job.id}
                  style={{ "--career-color": job.themeColor } as React.CSSProperties}
                >
                  <span className="career-path-icon">⚔</span>
                  <strong>{job.name}</strong>
                  <small>{job.completed} / {job.total} 스킬</small>
                  <div><span style={{ width: `${progress}%` }} /></div>
                  <b>{progress}%</b>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
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
