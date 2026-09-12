"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";

interface CareerPath {
  id: string;
  name: string;
  completed: number;
  total: number;
  themeColor: string;
}

function CardContent({ job }: { job: CareerPath }) {
  const progress = job.total ? Math.round((job.completed / job.total) * 100) : 0;
  return <><span className="career-path-icon">⚔</span><strong>{job.name}</strong><small>{job.completed} / {job.total} 스킬</small><div><span style={{ width: `${progress}%` }} /></div><b>{progress}%</b></>;
}

export function CareerPathCards({ jobs, selectable }: { jobs: CareerPath[]; selectable: boolean }) {
  const router = useRouter();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function selectTarget(job: CareerPath) {
    if (!window.confirm(`${job.name}를 목표 직업으로 설정할까요?`)) return;
    setSelectingId(job.id); setError("");
    const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetJobId: job.id }) });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) { setError(result?.error ?? "목표 직업을 설정하지 못했습니다."); setSelectingId(null); return; }
    router.refresh();
  }

  function frame(job: CareerPath, children: ReactNode) {
    const style = { "--career-color": job.themeColor } as CSSProperties;
    return selectable ? (
      <button className="career-path-option selectable" disabled={Boolean(selectingId)} key={job.id} onClick={() => selectTarget(job)} style={style} type="button">
        {children}<span className="career-path-action">{selectingId === job.id ? "설정 중..." : "목표로 설정"}</span>
      </button>
    ) : <Link className="career-path-option" href={`/skill-map?job=${job.id}`} key={job.id} style={style}>{children}</Link>;
  }

  return <>{error ? <p className="career-path-error" role="alert">{error}</p> : null}<div className="career-path-grid">{jobs.map((job) => frame(job, <CardContent job={job} />))}</div></>;
}
