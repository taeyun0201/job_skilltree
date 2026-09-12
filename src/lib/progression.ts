export const XP_PER_LEVEL = 100;

export function calculateProgress(totalXp: number) {
  return {
    totalXp,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    currentLevelXp: totalXp % XP_PER_LEVEL,
  };
}
