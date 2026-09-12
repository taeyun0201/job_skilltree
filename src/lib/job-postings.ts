import { randomUUID } from "node:crypto";
import { JOB_POSTINGS, type JobPosting } from "@/data/job-postings";
import { getDb } from "@/lib/mongodb";

type JobPostingDocument = JobPosting & { createdAt: Date; updatedAt: Date };

async function collection() {
  const db = await getDb();
  const postings = db.collection<JobPostingDocument>("job_postings");
  const marker = await db.collection<{ _id: string; seededAt: Date }>("app_meta").updateOne(
    { _id: "job-postings-seeded" },
    { $setOnInsert: { seededAt: new Date() } },
    { upsert: true },
  );

  if (marker.upsertedCount) {
    const now = new Date();
    await postings.insertMany(JOB_POSTINGS.map((posting) => ({ ...posting, createdAt: now, updatedAt: now })));
  }

  return postings;
}

export async function getJobPostings(): Promise<JobPosting[]> {
  return (await collection())
    .find({}, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } })
    .sort({ createdAt: -1 })
    .toArray() as Promise<JobPosting[]>;
}

export async function createJobPosting(posting: Omit<JobPosting, "id">) {
  const now = new Date();
  const document: JobPostingDocument = { ...posting, id: randomUUID(), createdAt: now, updatedAt: now };
  await (await collection()).insertOne(document);
  return { ...posting, id: document.id };
}

export async function updateJobPosting(id: string, posting: Omit<JobPosting, "id">) {
  const result = await (await collection()).findOneAndUpdate(
    { id },
    { $set: { ...posting, updatedAt: new Date() } },
    { returnDocument: "after", projection: { _id: 0, createdAt: 0, updatedAt: 0 } },
  );
  return result as JobPosting | null;
}

export async function deleteJobPosting(id: string) {
  return (await collection()).deleteOne({ id });
}
