import { NextResponse } from "next/server";
import { JOBS, SKILLS } from "@/data/skill-map";

export function GET() {
  return NextResponse.json({ jobs: JOBS, skills: SKILLS });
}
