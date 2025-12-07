import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/db";
import { ProfileContent } from "./ProfileContent";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect(`/${locale}/handler/sign-in?after_auth_return_to=/${locale}/profile`);
  }

  const role = await getUserRole(user.id);

  return (
    <ProfileContent 
      user={{
        id: user.id,
        displayName: user.displayName || null,
        primaryEmail: user.primaryEmail || "",
      }}
      userRole={role || "user"}
    />
  );
}

