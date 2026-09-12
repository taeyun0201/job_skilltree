import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SKILLS } from "@/data/skill-map";
import { getDb } from "@/lib/mongodb";
import type { UserSkill } from "@/types";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ skillId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { skillId } = await params;
  const skill = SKILLS.find((item) => item.id === skillId);
  if (!skill) {
    return NextResponse.json({ message: "존재하지 않는 스킬입니다." }, { status: 404 });
  }

  const prerequisiteKeys = skill.prerequisiteIds
    .map((id) => SKILLS.find((item) => item.id === id)?.skillKey)
    .filter((key): key is string => Boolean(key));
  const db = await getDb();
  const completedPrerequisites = await db
    .collection<UserSkill>("user_skills")
    .find({ userId: session.user.id, skillId: { $in: prerequisiteKeys } })
    .project<{ skillId: string }>({ _id: 0, skillId: 1 })
    .toArray();
  const completedKeys = new Set(completedPrerequisites.map((item) => item.skillId));
  const missingKeys = prerequisiteKeys.filter((key) => !completedKeys.has(key));

  if (missingKeys.length > 0) {
    const missingNames = missingKeys.map(
      (key) => SKILLS.find((item) => item.skillKey === key)?.name ?? key,
    );
    return NextResponse.json(
      { message: `선행 스킬이 필요합니다: ${missingNames.join(", ")}` },
      { status: 409 },
    );
  }

  await db.collection<UserSkill>("user_skills").updateOne(
    { userId: session.user.id, skillId: skill.skillKey },
    { $setOnInsert: { userId: session.user.id, skillId: skill.skillKey, unlockedAt: new Date() } },
    { upsert: true },
  );

  return NextResponse.json({ skillKey: skill.skillKey, xp: skill.xp });
}
