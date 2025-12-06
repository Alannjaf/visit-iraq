import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-session")?.value === "true";

  // Don't redirect on login page
  const isLoginPage = false; // This will be handled by the page itself

  if (!isAdmin && !isLoginPage) {
    // Allow children to render, they will handle auth themselves
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      {isAdmin && <AdminNav />}
      {children}
    </div>
  );
}

