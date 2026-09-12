export function CharacterCard({ level, experience }: { level: number; experience: number }) {
  return (
    <section className="card">
      <p className="eyebrow">LV. {level}</p>
      <div aria-label="도트 캐릭터 자리" style={{ fontSize: 80, textAlign: "center" }}>🧙</div>
      <p>{experience} / 100 XP</p>
      <div className="progress"><span style={{ width: `${experience}%` }} /></div>
    </section>
  );
}
