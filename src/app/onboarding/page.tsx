import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/types";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id || !ObjectId.isValid(session.user.id)) {
    redirect("/login");
  }

  const db = await getDb();
  const user = await db.collection<UserDocument>("users").findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { onboardingCompleted: 1 } },
  );

  if (!user) redirect("/login");
  if (user.onboardingCompleted) redirect("/dashboard");

  return <OnboardingForm />;
}
