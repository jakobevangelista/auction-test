import { SignIn, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
async function SignInPage() {
  const user = await currentUser();

  if (user) {
    redirect("/auction");
  }
  return (
    <div className="flex justify-center py-24">
      <SignIn />
    </div>
  );
}

export default SignInPage;
