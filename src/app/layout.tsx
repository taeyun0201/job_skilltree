import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career++",
  description: "직업 역량을 게임처럼 성장시키는 커리어 스킬트리",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <Link href="/" className="brand">Career++</Link>
          <nav>
            {session?.user ? (
              <>
                <Link href="/dashboard">내 캐릭터</Link>
                <Link href="/skill-map">커리어 스킬트리</Link>
                <Link href="/jobs">채용공고</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">로그인</Link>
                <Link className="button nav-signup" href="/signup">회원가입</Link>
              </>
            )}
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
