import { hash } from "bcryptjs";
import { MongoServerError } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "올바른 이메일을 입력해주세요." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 72) {
    return NextResponse.json({ error: "비밀번호는 8~72자로 입력해주세요." }, { status: 400 });
  }

  const now = new Date();
  const user: Omit<UserDocument, "_id"> = {
    email,
    passwordHash: await hash(password, 12),
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await getDb();
    const users = db.collection<UserDocument>("users");
    await users.createIndex({ email: 1 }, { unique: true });
    await users.insertOne(user);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }
    console.error("Signup failed:", error);
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }
}
