import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { JobPostingsBoard } from "@/components/jobs/JobPostingsBoard";
import { getJobPostings } from "@/lib/job-postings";
import { getDb } from "@/lib/mongodb";
import type { UserSkill } from "@/types";

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const db = await getDb();
  const postings = await getJobPostings();
  const unlockedSkills = await db
    .collection<UserSkill>("user_skills")
    .find({ userId: session.user.id })
    .project<{ skillId: string }>({ _id: 0, skillId: 1 })
    .toArray();

  return <JobPostingsBoard postings={postings} unlockedSkillKeys={unlockedSkills.map((item) => item.skillId)} />;
}
