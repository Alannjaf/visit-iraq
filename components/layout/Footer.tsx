import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      {/* Decorative Pattern */}
      <div className="h-2 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bottom */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Visit Iraq. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

