import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/db";
import { Link } from '@/i18n/routing';
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

export default async function HostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect(`/${locale}/handler/sign-in?after_auth_return_to=/${locale}/host`);
  }

  const role = await getUserRole(user.id);
  
  if (role !== "host" && role !== "admin") {
    redirect(`/${locale}/dashboard?upgrade=true`);
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <nav className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Visit Iraq"
                  width={234}
                  height={78}
                  className="h-[50px] w-auto"
                  priority
                />
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

