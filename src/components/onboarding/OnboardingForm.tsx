"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { JOBS } from "@/data/skill-map";

export function OnboardingForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterGender, setCharacterGender] = useState<"male" | "female">("female");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: formData.get("nickname"),
        characterGender: formData.get("characterGender"),
        characterVariant: formData.get("characterVariant"),
        major: formData.get("major"),
        age: formData.get("age"),
        interest: formData.get("interest"),
        targetJobId: formData.get("targetJobId"),
      }),
    }).catch(() => null);

    if (!response) {
      setError("서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.");
      setIsSaving(false);
      return;
    }

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(result?.error ?? "프로필을 저장하지 못했습니다.");
      setIsSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>모험가 정보 설정</h2>
      <label>닉네임<input name="nickname" required /></label>
      <label>캐릭터 성별<select name="characterGender" value={characterGender} onChange={(event) => setCharacterGender(event.target.value as "male" | "female")}><option value="female">여성</option><option value="male">남성</option></select></label>
      <fieldset className="character-picker">
        <legend>캐릭터 선택</legend>
        {[1, 2].map((variant) => (
          <label key={`${characterGender}-${variant}`}>
            <input type="radio" name="characterVariant" value={variant} defaultChecked={variant === 1} />
            <Image
              src={`/characters/${characterGender}-${variant}-lv1.png`}
              alt={`${characterGender === "female" ? "여성" : "남성"} 캐릭터 ${variant}`}
              width={150}
              height={150}
            />
            <strong>캐릭터 {variant}</strong>
          </label>
        ))}
      </fieldset>
      <label>전공 학과<input name="major" /></label>
      <label>나이<input name="age" type="number" min={14} max={100} /></label>
      <label>관심 분야<input name="interest" placeholder="예: 웹 개발" /></label>
      <label>
        목표 직업
        <select name="targetJobId">
          {JOBS.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}
        </select>
      </label>
      {error ? <p role="alert" style={{ color: "#ff8f8f" }}>{error}</p> : null}
      <button className="button primary" type="submit" disabled={isSaving}>
        {isSaving ? "저장 중..." : "모험 시작하기"}
      </button>
    </form>
  );
}
