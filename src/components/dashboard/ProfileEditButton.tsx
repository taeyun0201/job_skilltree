"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { JOBS } from "@/data/skill-map";

interface Props {
  nickname: string;
  characterGender: "male" | "female";
  characterVariant: 1 | 2;
  major: string;
  age?: number;
  interest: string;
  targetJobId: string;
}

export function ProfileEditButton(props: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: form.get("nickname"),
        characterGender: props.characterGender,
        characterVariant: props.characterVariant,
        major: form.get("major"),
        age: form.get("age"),
        interest: form.get("interest"),
        targetJobId: form.get("targetJobId"),
      }),
    });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) { setError(result?.error ?? "정보를 수정하지 못했습니다."); setSaving(false); return; }
    setOpen(false); setSaving(false); router.refresh();
  }

  return <>
    <button className="profile-edit-open" type="button" onClick={() => { setError(""); setOpen(true); }}>정보 수정</button>
    {open ? <div className="profile-edit-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setOpen(false); }}>
      <section className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
        <div className="profile-edit-heading"><div><p className="eyebrow">EDIT PROFILE</p><h2 id="profile-edit-title">모험가 정보 수정</h2></div><button aria-label="닫기" disabled={saving} type="button" onClick={() => setOpen(false)}>×</button></div>
        <form onSubmit={save}>
          <label>닉네임<input name="nickname" defaultValue={props.nickname} minLength={2} maxLength={20} required /></label>
          <label>전공 학과<input name="major" defaultValue={props.major} placeholder="선택 입력" /></label>
          <label>나이<input name="age" type="number" min={14} max={100} defaultValue={props.age ?? ""} placeholder="선택 입력" /></label>
          <label>관심 분야<input name="interest" defaultValue={props.interest} placeholder="예: 웹 개발" /></label>
          <label>목표 직업<select name="targetJobId" defaultValue={props.targetJobId}><option value="undecided">미정</option>{JOBS.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}</select></label>
          {error ? <p className="profile-edit-error" role="alert">{error}</p> : null}
          <div className="profile-edit-actions"><button className="button primary" disabled={saving} type="submit">{saving ? "저장 중..." : "변경 저장"}</button><button className="button" disabled={saving} type="button" onClick={() => setOpen(false)}>취소</button></div>
        </form>
      </section>
    </div> : null}
  </>;
}
