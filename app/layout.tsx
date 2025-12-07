import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Visit Iraq - Discover the Cradle of Civilization",
  description: "Explore Iraq's rich heritage, ancient wonders, and modern attractions. Find accommodations, tours, and attractions across this historic land.",
  keywords: ["Iraq", "tourism", "travel", "Baghdad", "Babylon", "Mesopotamia", "tours", "attractions"],
};

// Root layout - Next.js requires html/body tags here
// Locale-specific lang/dir are set via SetHtmlAttributes component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
