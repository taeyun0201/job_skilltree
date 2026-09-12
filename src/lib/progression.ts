export const XP_PER_SKILL = 50;
export const XP_PER_LEVEL = 100;

export function calculateProgress(completedSkillCount: number) {
  const totalXp = completedSkillCount * XP_PER_SKILL;
  return {
    totalXp,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    currentLevelXp: totalXp % XP_PER_LEVEL,
  };
}
