import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Muse. — Studio d'esthétique",
  description: "Soins du visage et du corps. Réservez en ligne 24h/24.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Muse." },
  icons: { icon: "/Muse192.png", apple: "/Muse192.png" },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${interTight.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
