export function SkillSummary({ completed, targetJob }: { completed: number; targetJob: string }) {
  return (
    <section className="card">
      <h2>성장 요약</h2>
      <p>목표 직업: {targetJob}</p>
      <p>해금한 스킬: {completed}개</p>
      <p>다음 추천 스킬: JavaScript 기초</p>
    </section>
  );
}
