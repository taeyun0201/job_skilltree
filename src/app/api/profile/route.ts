import { NextResponse } from "next/server";

export async function GET() {
  // TODO(auth/db): 인증된 사용자의 프로필을 MongoDB에서 조회합니다.
  return NextResponse.json({ message: "profile API placeholder" }, { status: 501 });
}

export async function PATCH() {
  // TODO(auth/db): 온보딩 또는 목표 직업 변경 내용을 검증해 저장합니다.
  return NextResponse.json({ message: "profile API placeholder" }, { status: 501 });
}
