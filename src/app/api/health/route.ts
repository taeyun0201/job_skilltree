import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      service: "career-skill-tree",
      database: "connected",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? `${error.name}: ${error.message}`
        : undefined;

    return NextResponse.json(
      {
        ok: false,
        service: "career-skill-tree",
        database: "disconnected",
        ...(detail ? { detail } : {}),
      },
      { status: 500 },
    );
  }
}
