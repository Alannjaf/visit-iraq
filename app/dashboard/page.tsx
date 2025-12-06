import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole, setUserRole } from "@/lib/db";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=/dashboard");
  }

  // Ensure user has a role
  let role = await getUserRole(user.id);
  if (!role) {
    await setUserRole(user.id, "user");
    role = "user";
  }

  const params = await searchParams;
  const showUpgrade = params.upgrade === "true";

  return (
    <DashboardContent 
      user={{
        id: user.id,
        displayName: user.displayName || null,
        primaryEmail: user.primaryEmail || "",
      }}
      userRole={role}
      showUpgrade={showUpgrade}
    />
  );
}
