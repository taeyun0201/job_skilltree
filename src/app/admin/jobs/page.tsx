import { JobPostingAdmin } from "@/components/admin/JobPostingAdmin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getJobPostings } from "@/lib/job-postings";

export default async function AdminJobsPage() {
  const authenticated = await isAdminAuthenticated();
  const postings = authenticated ? await getJobPostings() : [];
  return <JobPostingAdmin initialAuthenticated={authenticated} initialPostings={postings} />;
}
