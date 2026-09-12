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
  if (targetJobId !== "undecided" && !JOBS.some((job) => job.id === targetJobId)) {
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
        targetJobId,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      $unset: {
        ...(major ? {} : { major: "" }),
        ...(age !== undefined ? {} : { age: "" }),
        ...(interest ? {} : { interest: "" }),
      },
      ...(major || age !== undefined || interest ? {
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
      } : {}),
    },
  );

  if (!result.matchedCount) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { targetJobId?: unknown } | null;
  const targetJobId = typeof body?.targetJobId === "string" ? body.targetJobId : "";
  if (!JOBS.some((job) => job.id === targetJobId)) {
    return NextResponse.json({ error: "올바른 목표 직업을 선택해주세요." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection<UserDocument>("users").updateOne(
    { _id: userId, targetJobId: "undecided" },
    { $set: { targetJobId, updatedAt: new Date() } },
  );
  if (!result.matchedCount) {
    return NextResponse.json({ error: "미정 상태에서만 목표 직업을 설정할 수 있습니다." }, { status: 409 });
  }
  return NextResponse.json({ targetJobId });
}

export async function DELETE() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const db = await getDb();
  const transaction = db.client.startSession();
  let deletedSkills = 0;

  try {
    await transaction.withTransaction(async () => {
      const user = await db
        .collection<UserDocument>("users")
        .findOne({ _id: userId }, { session: transaction, projection: { _id: 1 } });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const skillsResult = await db.collection("user_skills").deleteMany(
        { userId: userId.toHexString() },
        { session: transaction },
      );
      deletedSkills = skillsResult.deletedCount;

      await db.collection<UserDocument>("users").deleteOne(
        { _id: userId },
        { session: transaction },
      );
    });

    return NextResponse.json({ deleted: true, deletedSkills });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    console.error("계정 삭제 중 오류가 발생했습니다.", error);
    return NextResponse.json({ error: "계정을 삭제하지 못했습니다." }, { status: 500 });
  } finally {
    await transaction.endSession();
  }
}
