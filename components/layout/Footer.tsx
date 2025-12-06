import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      {/* Decorative Pattern */}
      <div className="h-2 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--secondary)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold">Visit Iraq</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Discover the cradle of civilization. Explore Iraq&apos;s ancient wonders, 
              vibrant culture, and warm hospitality.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-[var(--secondary)] mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings?type=accommodation" className="text-white/70 hover:text-white transition-colors">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/listings?type=attraction" className="text-white/70 hover:text-white transition-colors">
                  Attractions
                </Link>
              </li>
              <li>
                <Link href="/listings?type=tour" className="text-white/70 hover:text-white transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-white/70 hover:text-white transition-colors">
                  All Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-semibold text-[var(--secondary)] mb-4">Popular Regions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings?city=Baghdad" className="text-white/70 hover:text-white transition-colors">
                  Baghdad
                </Link>
              </li>
              <li>
                <Link href="/listings?city=Erbil" className="text-white/70 hover:text-white transition-colors">
                  Erbil
                </Link>
              </li>
              <li>
                <Link href="/listings?city=Basra" className="text-white/70 hover:text-white transition-colors">
                  Basra
                </Link>
              </li>
              <li>
                <Link href="/listings?city=Najaf" className="text-white/70 hover:text-white transition-colors">
                  Najaf
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="font-semibold text-[var(--secondary)] mb-4">For Partners</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/handler/sign-up" className="text-white/70 hover:text-white transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/host" className="text-white/70 hover:text-white transition-colors">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link href="/handler/sign-in" className="text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
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

