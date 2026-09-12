import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { JOBS } from "@/data/skill-map";
import { getDb } from "@/lib/mongodb";
import type { UserDocument, UserProfile } from "@/types";

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id && ObjectId.isValid(session.user.id)
    ? new ObjectId(session.user.id)
    : null;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const db = await getDb();
  const user = await db
    .collection<UserDocument>("users")
    .findOne({ _id: userId }, { projection: { passwordHash: 0 } });

  if (!user) {
    return NextResponse.json({ profile: null }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      userId: user._id.toHexString(),
      nickname: user.nickname ?? "",
      characterGender: user.characterGender,
      characterVariant: user.characterVariant ?? 1,
      major: user.major,
      age: user.age,
      interest: user.interest,
      targetJobId: user.targetJobId,
      onboardingCompleted: user.onboardingCompleted,
    },
  });
}

export async function PATCH(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  const characterGender = body.characterGender;
  const characterVariant = Number(body.characterVariant);
  const major = typeof body.major === "string" ? body.major.trim() : "";
  const interest = typeof body.interest === "string" ? body.interest.trim() : "";
  const targetJobId = typeof body.targetJobId === "string" ? body.targetJobId : "";
  const age = body.age === "" || body.age == null ? undefined : Number(body.age);

  if (nickname.length < 2 || nickname.length > 20) {
    return NextResponse.json({ error: "닉네임은 2~20자로 입력해주세요." }, { status: 400 });
  }
  if (characterGender !== "male" && characterGender !== "female") {
    return NextResponse.json({ error: "캐릭터 성별을 선택해주세요." }, { status: 400 });
  }
  if (characterVariant !== 1 && characterVariant !== 2) {
    return NextResponse.json({ error: "캐릭터를 선택해주세요." }, { status: 400 });
  }
  if (age !== undefined && (!Number.isInteger(age) || age < 14 || age > 100)) {
    return NextResponse.json({ error: "나이는 14~100 사이의 정수로 입력해주세요." }, { status: 400 });
  }
  if (!JOBS.some((job) => job.id === targetJobId)) {
    return NextResponse.json({ error: "목표 직업을 선택해주세요." }, { status: 400 });
  }

  const profile: UserProfile = {
    userId: userId.toHexString(),
    nickname,
    characterGender,
    characterVariant,
    ...(major ? { major } : {}),
    ...(age !== undefined ? { age } : {}),
    ...(interest ? { interest } : {}),
    targetJobId,
    onboardingCompleted: true,
  };

  const db = await getDb();
  const result = await db.collection<UserDocument>("users").updateOne(
    { _id: userId },
    {
      $set: {
        nickname,
        characterGender,
        characterVariant,
        ...(major ? { major } : {}),
        ...(age !== undefined ? { age } : {}),
        ...(interest ? { interest } : {}),
        targetJobId,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
    },
  );

  if (!result.matchedCount) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}
