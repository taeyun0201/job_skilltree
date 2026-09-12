import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { SkillMap } from "@/components/skill-map/SkillMap";
import { JOBS } from "@/data/skill-map";
import { getDb } from "@/lib/mongodb";
import type { UserDocument, UserSkill } from "@/types";

export default async function SkillMapPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { job } = await searchParams;

  const db = await getDb();
  const user = ObjectId.isValid(session.user.id)
    ? await db.collection<UserDocument>("users").findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { targetJobId: 1 } },
      )
    : null;
  const unlockedSkills = await db
    .collection<UserSkill>("user_skills")
    .find({ userId: session.user.id })
    .project<{ skillId: string }>({ _id: 0, skillId: 1 })
    .toArray();

  return (
    <SkillMap
      initialUnlockedSkillKeys={unlockedSkills.map((item) => item.skillId)}
      targetJobId={JOBS.some((item) => item.id === job) ? job : user?.targetJobId}
    />
  );
}
