"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(isSignup ? "/onboarding" : "/dashboard");
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>{isSignup ? "회원가입" : "로그인"}</h2>
      <label>이메일<input name="email" type="email" required /></label>
      <label>비밀번호<input name="password" type="password" minLength={6} required /></label>
      <button className="button primary" type="submit">{isSignup ? "계정 만들기" : "로그인"}</button>
      <small className="muted">현재는 화면 연결용 폼입니다. 인증 담당자가 실제 인증을 연결합니다.</small>
    </form>
  );
}
