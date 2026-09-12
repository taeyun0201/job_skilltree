import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Skill Tree",
  description: "직업 역량을 게임처럼 성장시키는 커리어 스킬트리",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <Link href="/" className="brand">Career Skill Tree</Link>
          <nav>
            <Link href="/dashboard">내 캐릭터</Link>
            <Link href="/skill-map">스킬맵</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
