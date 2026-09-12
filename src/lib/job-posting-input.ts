import { JOBS } from "@/data/skill-map";
import type { JobPosting } from "@/data/job-postings";

export function parseJobPostingInput(value: unknown): Omit<JobPosting, "id"> | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const text = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const jobId = text("jobId");
  const skills = Array.isArray(body.skills)
    ? body.skills.filter((skill): skill is string => typeof skill === "string").map((skill) => skill.trim()).filter(Boolean)
    : text("skills").split(",").map((skill) => skill.trim()).filter(Boolean);
  const posting = {
    jobId,
    sourceJobName: text("sourceJobName"),
    company: text("company"),
    title: text("title"),
    experience: text("experience"),
    location: text("location"),
    skills,
    deadline: text("deadline"),
    site: text("site"),
    url: text("url"),
  };

  if (!JOBS.some((job) => job.id === jobId)) return null;
  if (Object.entries(posting).some(([key, item]) => key !== "skills" && !item)) return null;
  if (!skills.length) return null;
  try {
    const url = new URL(posting.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return posting;
}
