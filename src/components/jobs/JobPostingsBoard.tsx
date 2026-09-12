"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { JOBS } from "@/data/skill-map";
import type { JobPosting } from "@/data/job-postings";

const POSTING_SKILL_KEYS: Record<string, string[]> = {
  Python: ["python"], PostgreSQL: ["database"], MySQL: ["database"], Git: ["git"], GitHub: ["git"],
  React: ["react"], "React.js": ["react"], "React Native": ["react"], "React/Next.js": ["react", "nextjs"],
  "Next.js": ["nextjs"], TypeScript: ["typescript"], JavaScript: ["javascript"], HTML5: ["html"], CSS3: ["css"],
  "REST API": ["rest-api"], "A/B Test": ["ab-testing"], "Web Vitals": ["web-performance"], Java: ["java"],
  "Spring Boot": ["spring-boot"], Redis: ["redis"], Docker: ["docker"], AWS: ["aws"], Linux: ["linux"], PyTorch: ["deep-learning"],
};

function getPostingMatch(posting: JobPosting, unlocked: Set<string>) {
  const comparable = posting.skills.filter((skill) => POSTING_SKILL_KEYS[skill]);
  const matched = comparable.filter((skill) => POSTING_SKILL_KEYS[skill].some((key) => unlocked.has(key)));
  const missing = comparable.filter((skill) => !matched.includes(skill));
  return { matched, missing, percent: comparable.length ? Math.round((matched.length / comparable.length) * 100) : 0 };
}

export function JobPostingsBoard({ postings, unlockedSkillKeys }: { postings: JobPosting[]; unlockedSkillKeys: string[] }) {
  const [activeJobId, setActiveJobId] = useState("all");
  const unlocked = useMemo(() => new Set(unlockedSkillKeys), [unlockedSkillKeys]);
  const filtered = useMemo(
    () => (activeJobId === "all" ? postings : postings.filter((item) => item.jobId === activeJobId))
      .map((posting) => ({ posting, match: getPostingMatch(posting, unlocked) }))
      .sort((a, b) => b.match.percent - a.match.percent),
    [activeJobId, postings, unlocked],
  );
  const activeJob = JOBS.find((job) => job.id === activeJobId);

  return (
    <section className="job-board-shell">
      <header className="job-board-hero">
        <div><span className="pixel-kicker">CAREER QUEST BOARD</span><h1>채용공고</h1><p>직업 노드를 선택해 원하는 분야의 공고만 확인하세요.</p></div>
        <strong>{filtered.length}개의 공고</strong>
      </header>
      <div className="job-node-filters" role="group" aria-label="직업별 채용공고 필터">
        <button className={activeJobId === "all" ? "active" : ""} type="button" onClick={() => setActiveJobId("all")}><span>✦</span><strong>전체 직업</strong><small>{postings.length}개</small></button>
        {JOBS.map((job) => {
          const count = postings.filter((item) => item.jobId === job.id).length;
          return <button className={activeJobId === job.id ? "active" : ""} key={job.id} type="button" style={{ "--job-color": job.themeColor } as CSSProperties} onClick={() => setActiveJobId(job.id)}><span>⚔</span><strong>{job.name}</strong><small>{count}개</small></button>;
        })}
      </div>
      {filtered.length ? (
        <div className="job-posting-grid">
          {filtered.map(({ posting, match }) => (
            <article className="job-posting-card" key={posting.id}>
              <div className="job-posting-heading"><div><span>{posting.company}</span><h2>{posting.title}</h2></div><span className="job-posting-deadline">{posting.deadline}</span></div>
              <div className="job-posting-meta"><span>▣ {posting.experience}</span><span>⌖ {posting.location}</span><span>◆ {posting.sourceJobName}</span></div>
              <div className="job-match-panel"><div className="job-match-heading"><strong>나의 스킬 일치율</strong><b>{match.percent}%</b></div><div className="job-match-track"><span style={{ width: `${match.percent}%` }} /></div><small>스킬트리에서 학습 가능한 기술을 기준으로 계산됩니다.</small></div>
              <div className="job-skill-tags" aria-label="핵심 스킬">{posting.skills.map((skill) => <span className={match.matched.includes(skill) ? "matched" : POSTING_SKILL_KEYS[skill] ? "missing" : "external"} key={skill}>{skill}</span>)}</div>
              <div className="job-match-summary"><p><strong>보유 스킬</strong>{match.matched.length ? match.matched.join(" · ") : "없음"}</p><p><strong>필요 스킬</strong>{match.missing.length ? match.missing.join(" · ") : "없음"}</p></div>
              <a href={posting.url} target="_blank" rel="noopener noreferrer">{posting.site}에서 공고 보기 <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      ) : <div className="job-posting-empty"><span>▣</span><h2>{activeJob?.name} 채용공고가 없습니다</h2><p>현재 등록된 공고가 없어요.</p></div>}
      <footer className="job-board-footer"><Link href="/admin/jobs">관리자</Link></footer>
    </section>
  );
}
