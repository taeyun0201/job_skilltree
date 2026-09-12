import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseJobPostingInput } from "@/lib/job-posting-input";
import { deleteJobPosting, updateJobPosting } from "@/lib/job-postings";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const posting = parseJobPostingInput(await request.json().catch(() => null));
  if (!posting) return NextResponse.json({ error: "모든 항목을 올바르게 입력해주세요." }, { status: 400 });
  const { id } = await params;
  const updated = await updateJobPosting(id, posting);
  return updated
    ? NextResponse.json({ posting: updated })
    : NextResponse.json({ error: "공고를 찾을 수 없습니다." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const { id } = await params;
  const result = await deleteJobPosting(id);
  return result.deletedCount
    ? NextResponse.json({ deleted: true })
    : NextResponse.json({ error: "공고를 찾을 수 없습니다." }, { status: 404 });
}
