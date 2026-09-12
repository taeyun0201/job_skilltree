"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export function OnboardingForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>모험가 정보 설정</h2>
      <label>닉네임<input name="nickname" required /></label>
      <label>캐릭터 성별<select name="characterGender"><option value="male">남성</option><option value="female">여성</option></select></label>
      <label>전공 학과<input name="major" /></label>
      <label>나이<input name="age" type="number" min={14} max={100} /></label>
      <label>관심 분야<input name="interest" placeholder="예: 웹 개발" /></label>
      <label>목표 직업<select name="targetJobId"><option value="frontend">프론트엔드 개발자</option><option value="backend">백엔드 개발자</option></select></label>
      <button className="button primary" type="submit">모험 시작하기</button>
    </form>
  );
}
