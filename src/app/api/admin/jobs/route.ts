import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseJobPostingInput } from "@/lib/job-posting-input";
import { createJobPosting, getJobPostings } from "@/lib/job-postings";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  return NextResponse.json({ postings: await getJobPostings() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const posting = parseJobPostingInput(await request.json().catch(() => null));
  if (!posting) return NextResponse.json({ error: "모든 항목을 올바르게 입력해주세요." }, { status: 400 });
  return NextResponse.json({ posting: await createJobPosting(posting) }, { status: 201 });
}
