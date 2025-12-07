import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole, setUserRole } from "@/lib/db";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const { locale } = await params;
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect(`/${locale}/handler/sign-in?after_auth_return_to=/${locale}/dashboard`);
  }

  // Ensure user has a role
  let role = await getUserRole(user.id);
  if (!role) {
    await setUserRole(user.id, "user");
    role = "user";
  }

  const searchParamsResolved = await searchParams;
  const showUpgrade = searchParamsResolved.upgrade === "true";

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

