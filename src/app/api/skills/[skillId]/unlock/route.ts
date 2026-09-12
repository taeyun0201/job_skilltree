import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ skillId: string }> },
) {
  const { skillId } = await params;
  // TODO(auth/db): 선수 조건 확인 후 userId + skillId를 유니크하게 저장합니다.
  return NextResponse.json({ message: "unlock API placeholder", skillId }, { status: 501 });
}
