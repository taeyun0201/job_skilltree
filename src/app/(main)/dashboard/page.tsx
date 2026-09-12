import Link from "next/link";
import { CharacterCard } from "@/components/dashboard/CharacterCard";
import { SkillSummary } from "@/components/dashboard/SkillSummary";

export default function DashboardPage() {
  return (
    <>
      <h2>내 캐릭터</h2>
      <div className="grid">
        <CharacterCard level={2} experience={50} />
        <SkillSummary completed={3} targetJob="프론트엔드 개발자" />
      </div>
      <div className="actions"><Link className="button primary" href="/skill-map">스킬맵 탐험하기</Link></div>
    </>
  );
}
