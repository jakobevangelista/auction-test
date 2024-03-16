import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function confirmUser() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return user;
}
