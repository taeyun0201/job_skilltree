import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <section className="landing-page">
      <div className="landing-content">
        <p className="landing-kicker">LEVEL UP YOUR CAREER</p>
        <h1>오늘의 나를<br />한 단계 업데이트</h1>
        <p className="landing-copy">
          지금 가진 스킬을 발견하고,<br />
          다음 스킬을 채우고,<br />
          새로운 커리어를 열어보세요.
        </p>
        <Link className="landing-start" href={session?.user ? "/dashboard" : "/login"}>
          <span aria-hidden="true">[</span> Career++ 시작하기 <span aria-hidden="true">]</span>
        </Link>
        {!session?.user ? <Link className="landing-login" href="/signup">계정이 없다면? 회원가입</Link> : null}
      </div>
    </section>
  );
}
