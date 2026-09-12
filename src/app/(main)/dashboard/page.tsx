import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CharacterCard } from "@/components/dashboard/CharacterCard";
import { SkillSummary } from "@/components/dashboard/SkillSummary";
import { JOBS, SKILLS } from "@/data/skill-map";
import { getDb } from "@/lib/mongodb";
import { calculateProgress } from "@/lib/progression";
import type { UserDocument, UserSkill } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id || !ObjectId.isValid(session.user.id)) redirect("/login");

  const db = await getDb();
  const user = await db
    .collection<UserDocument>("users")
    .findOne({ _id: new ObjectId(session.user.id) });

  if (!user?.onboardingCompleted) redirect("/onboarding");

  const unlockedSkills = await db
    .collection<UserSkill>("user_skills")
    .find({ userId: session.user.id })
    .sort({ unlockedAt: -1 })
    .project<UserSkill>({ _id: 0, skillId: 1, unlockedAt: 1, userId: 1 })
    .toArray();

  const unlockedSkillKeys = new Set(unlockedSkills.map(({ skillId }) => skillId));
  const xpBySkillKey = new Map<string, number>();
  for (const skill of SKILLS) {
    if (!xpBySkillKey.has(skill.skillKey)) xpBySkillKey.set(skill.skillKey, skill.xp);
  }
  const totalXp = [...unlockedSkillKeys].reduce(
    (sum, skillKey) => sum + (xpBySkillKey.get(skillKey) ?? 0),
    0,
  );
  const progress = calculateProgress(totalXp);
  const targetJob = JOBS.find(({ id }) => id === user.targetJobId);
  const targetSkills = SKILLS.filter((skill) => skill.jobIds.includes(user.targetJobId ?? ""));
  const targetSkillKeys = new Set(targetSkills.map((skill) => skill.skillKey));
  const targetCompleted = [...targetSkillKeys].filter((key) => unlockedSkillKeys.has(key)).length;
  const nextSkills = targetSkills.filter(
    (skill) =>
      !unlockedSkillKeys.has(skill.skillKey) &&
      skill.prerequisiteIds.every((id) => {
        const prerequisite = SKILLS.find((item) => item.id === id);
        return prerequisite ? unlockedSkillKeys.has(prerequisite.skillKey) : false;
      }),
  ).slice(0, 3);
  const skillNameByKey = new Map(SKILLS.map((skill) => [skill.skillKey, skill.name]));
  const recentSkills = unlockedSkills.slice(0, 5).map((item) => ({
    name: skillNameByKey.get(item.skillId) ?? item.skillId,
    unlockedAt: item.unlockedAt,
  }));

  return (
    <>
      <header className="dashboard-hero">
        <div><p className="eyebrow">MY ADVENTURE</p><h1>{user.nickname}님의 성장 기록</h1></div>
        <p>스킬을 해금하고 나만의 커리어를 성장시켜보세요.</p>
      </header>
      <div className="dashboard-layout">
        <CharacterCard
          nickname={user.nickname ?? "모험가"}
          characterGender={user.characterGender ?? "male"}
          characterVariant={user.characterVariant ?? 1}
          level={progress.level}
          experience={progress.currentLevelXp}
          totalExperience={progress.totalXp}
        />
        <SkillSummary
          completed={unlockedSkillKeys.size}
          totalSkills={xpBySkillKey.size}
          targetJob={targetJob?.name ?? "미정"}
          targetCompleted={targetCompleted}
          targetTotal={targetSkillKeys.size}
          major={user.major ?? ""}
          interest={user.interest ?? ""}
          age={user.age}
          nextSkills={nextSkills.map((skill) => ({ name: skill.name, xp: skill.xp }))}
          recentSkills={recentSkills}
        />
      </div>
    </>
  );
}
