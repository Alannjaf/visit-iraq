import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/db";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=/host");
  }

  const role = await getUserRole(user.id);
  
  if (role !== "host" && role !== "admin") {
    redirect("/dashboard?upgrade=true");
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <nav className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-bold text-[var(--primary)]">Host Dashboard</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/host" 
                  className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  My Listings
                </Link>
                <Link 
                  href="/host/new" 
                  className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  Add Listing
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors text-sm"
              >
                View Site
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

