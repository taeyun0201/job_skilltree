"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOBS } from "@/data/skill-map";
import type { JobPosting } from "@/data/job-postings";

type FormState = Omit<JobPosting, "id" | "skills"> & { skills: string };
const EMPTY_FORM: FormState = { jobId: JOBS[0].id, sourceJobName: JOBS[0].name, company: "", title: "", experience: "", location: "", skills: "", deadline: "상시채용", site: "", url: "" };
const toForm = (posting: JobPosting): FormState => ({ ...posting, skills: posting.skills.join(", ") });

export function JobPostingAdmin({ initialAuthenticated, initialPostings }: { initialAuthenticated: boolean; initialPostings: JobPosting[] }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [password, setPassword] = useState("");
  const [postings, setPostings] = useState(initialPostings);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) { setMessage(result?.error ?? "로그인에 실패했습니다."); setBusy(false); return; }
    setAuthenticated(true); setPassword(""); setBusy(false); router.refresh();
    const listResponse = await fetch("/api/admin/jobs");
    const list = (await listResponse.json().catch(() => null)) as { postings?: JobPosting[] } | null;
    if (list?.postings) setPostings(list.postings);
  }

  const change = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  function changeJob(jobId: string) { const job = JOBS.find((item) => item.id === jobId); setForm((current) => ({ ...current, jobId, sourceJobName: job?.name ?? current.sourceJobName })); }
  function resetForm() { setEditingId(null); setForm(EMPTY_FORM); setMessage(""); }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch(editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = (await response.json().catch(() => null)) as { posting?: JobPosting; error?: string } | null;
    if (!response.ok || !result?.posting) { setMessage(result?.error ?? "공고를 저장하지 못했습니다."); setBusy(false); return; }
    const saved = result.posting;
    setPostings((current) => editingId ? current.map((posting) => posting.id === editingId ? saved : posting) : [saved, ...current]);
    setMessage(editingId ? "공고를 수정했습니다." : "새 공고를 등록했습니다."); setEditingId(null); setForm(EMPTY_FORM); setBusy(false);
  }

  async function remove(posting: JobPosting) {
    if (!window.confirm(`‘${posting.title}’ 공고를 삭제할까요?`)) return;
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/jobs/${posting.id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) setMessage(result?.error ?? "공고를 삭제하지 못했습니다.");
    else { setPostings((current) => current.filter((item) => item.id !== posting.id)); if (editingId === posting.id) { setEditingId(null); setForm(EMPTY_FORM); } setMessage("공고를 삭제했습니다."); }
    setBusy(false);
  }

  async function logout() { await fetch("/api/admin/login", { method: "DELETE" }); setAuthenticated(false); setPostings([]); resetForm(); router.refresh(); }

  if (!authenticated) return (
    <section className="admin-login-panel"><p className="pixel-kicker">ADMIN ACCESS</p><h1>채용공고 관리자</h1><p>관리자 비밀번호를 입력해주세요.</p>
      <form onSubmit={login}><label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /></label>{message ? <p className="admin-message error" role="alert">{message}</p> : null}<button className="button primary" disabled={busy} type="submit">{busy ? "확인 중..." : "관리자 로그인"}</button></form>
    </section>
  );

  return (
    <section className="admin-jobs-shell">
      <header className="admin-jobs-header"><div><p className="pixel-kicker">QUEST CONTROL</p><h1>채용공고 관리</h1><p>공고를 등록하거나 기존 정보를 수정·삭제할 수 있습니다.</p></div><div><a className="button" href="/jobs">채용공고 보기</a><button className="button" type="button" onClick={logout}>관리자 로그아웃</button></div></header>
      <div className="admin-jobs-layout">
        <form className="admin-job-form" onSubmit={save}>
          <h2>{editingId ? "채용공고 수정" : "새 채용공고"}</h2>
          <label>직업<select value={form.jobId} onChange={(event) => changeJob(event.target.value)}>{JOBS.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}</select></label>
          <div className="admin-form-row"><label>회사명<input value={form.company} onChange={(event) => change("company", event.target.value)} required /></label><label>채용 사이트<input value={form.site} onChange={(event) => change("site", event.target.value)} required /></label></div>
          <label>공고 제목<input value={form.title} onChange={(event) => change("title", event.target.value)} required /></label>
          <div className="admin-form-row"><label>경력<input value={form.experience} onChange={(event) => change("experience", event.target.value)} required /></label><label>근무 지역<input value={form.location} onChange={(event) => change("location", event.target.value)} required /></label></div>
          <label>기술 목록<input value={form.skills} onChange={(event) => change("skills", event.target.value)} placeholder="React, TypeScript, Git" required /><small>쉼표로 구분해주세요.</small></label>
          <div className="admin-form-row"><label>마감 정보<input value={form.deadline} onChange={(event) => change("deadline", event.target.value)} required /></label><label>표시 직업명<input value={form.sourceJobName} onChange={(event) => change("sourceJobName", event.target.value)} required /></label></div>
          <label>공고 링크<input type="url" value={form.url} onChange={(event) => change("url", event.target.value)} placeholder="https://..." required /></label>
          {message ? <p className="admin-message" role="status">{message}</p> : null}<div className="admin-form-actions"><button className="button primary" disabled={busy} type="submit">{busy ? "저장 중..." : editingId ? "수정 저장" : "공고 등록"}</button>{editingId ? <button className="button" type="button" onClick={resetForm}>수정 취소</button> : null}</div>
        </form>
        <div className="admin-posting-list"><h2>등록된 공고 <span>{postings.length}</span></h2>{postings.map((posting) => <article key={posting.id}><div><small>{posting.company} · {JOBS.find((job) => job.id === posting.jobId)?.name}</small><h3>{posting.title}</h3><p>{posting.experience} · {posting.location} · {posting.deadline}</p></div><div><button type="button" onClick={() => { setEditingId(posting.id); setForm(toForm(posting)); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>수정</button><button className="delete" disabled={busy} type="button" onClick={() => remove(posting)}>삭제</button></div></article>)}{!postings.length ? <p className="admin-empty">등록된 채용공고가 없습니다.</p> : null}</div>
      </div>
    </section>
  );
}
