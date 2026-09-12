"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (isSignup) {
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).catch(() => null);

      if (!signupResponse?.ok) {
        const data = signupResponse ? await signupResponse.json().catch(() => null) : null;
        setError(data?.error ?? "회원가입에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        isSignup
          ? "가입은 완료됐지만 로그인에 실패했습니다."
          : "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
      setIsSubmitting(false);
      return;
    }

    const profileResponse = await fetch("/api/profile", { cache: "no-store" });
    const profileData = await profileResponse.json().catch(() => null);
    const destination = profileData?.profile?.onboardingCompleted
      ? "/dashboard"
      : "/onboarding";

    router.replace(destination);
    router.refresh();
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>{isSignup ? "회원가입" : "로그인"}</h2>
      <label>
        이메일
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        비밀번호
        <input
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          maxLength={72}
          required
        />
      </label>
      {error ? <p role="alert" style={{ color: "#ff8f8f" }}>{error}</p> : null}
      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "처리 중..." : isSignup ? "계정 만들기" : "로그인"}
      </button>
      <small className="muted">
        {isSignup ? "이미 계정이 있나요? " : "아직 계정이 없나요? "}
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "로그인" : "회원가입"}
        </Link>
      </small>
    </form>
  );
}
