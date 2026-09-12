"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteAccount() {
    const confirmed = window.confirm(
      "계정을 삭제하면 캐릭터 정보와 해금한 스킬이 모두 사라집니다. 정말 삭제할까요?",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/profile", { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "계정을 삭제하지 못했습니다.");
      }

      await signOut({ callbackUrl: "/" });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "계정을 삭제하지 못했습니다.");
      setIsDeleting(false);
    }
  }

  return (
    <section className="account-danger-zone" aria-label="계정 관리">
      {error ? <p className="account-delete-error" role="alert">{error}</p> : null}
      <button
        className="account-delete-button"
        type="button"
        disabled={isDeleting}
        onClick={deleteAccount}
      >
        {isDeleting ? "삭제 중..." : "계정 삭제"}
      </button>
    </section>
  );
}
