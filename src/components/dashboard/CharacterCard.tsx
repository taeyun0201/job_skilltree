import Image from "next/image";

interface CharacterCardProps {
  nickname: string;
  characterGender: "male" | "female";
  characterVariant: 1 | 2;
  level: number;
  experience: number;
  totalExperience: number;
}

export function CharacterCard({
  nickname,
  characterGender,
  characterVariant,
  level,
  experience,
  totalExperience,
}: CharacterCardProps) {
  const stage = level >= 10 ? 10 : level >= 6 ? 6 : level >= 3 ? 3 : 1;
  const characterImage = `/characters/${characterGender}-${characterVariant}-lv${stage}.png`;

  return (
    <section className="card">
      <p className="eyebrow">LV. {level}</p>
      <div className="character-stage" aria-label={nickname + " 캐릭터"}>
        <Image
          src={characterImage}
          alt={`${nickname}의 레벨 ${stage} 외형`}
          width={1250}
          height={1250}
          sizes="(max-width: 760px) 90vw, 520px"
          priority
        />
      </div>
      <h2 style={{ textAlign: "center" }}>{nickname}</h2>
      <p>{experience} / 100 XP</p>
      <div className="progress"><span style={{ width: experience + "%" }} /></div>
      <p className="muted">누적 경험치: {totalExperience} XP</p>
    </section>
  );
}
