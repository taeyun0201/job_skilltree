import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <p className="eyebrow">6시간 해커톤 MVP</p>
      <h1>배운 기술이 캐릭터의 힘이 되는 커리어 RPG</h1>
      <p>목표 직업의 스킬을 탐색하고, 학습을 완료해 캐릭터를 성장시키세요.</p>
      <div className="actions">
        <Link className="button primary" href="/signup">시작하기</Link>
        <Link className="button" href="/login">로그인</Link>
      </div>
    </section>
  );
}
