import confirmUser from "@/lib/authHelper";
import { OnboardingForm } from "./OnboardingForm";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { user } from "@/server/db/schema";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const clerkUser = await confirmUser();
  const isAlreadyOnboarded = await db.query.user.findFirst({
    where: eq(user.clerkId, clerkUser.id),
  });

  if (isAlreadyOnboarded) {
    redirect("/auction");
  }

  return (
    <>
      <OnboardingForm
        clerkId={clerkUser.id}
        email={clerkUser.emailAddresses[0]!.emailAddress}
      />
    </>
  );
}
