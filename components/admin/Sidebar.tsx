"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome,
  IconCalendar,
  IconSprinkler,
  IconFolder,
  IconTeam,
  IconClients,
  IconWallet,
  IconClock,
  IconBell,
  IconProfile,
  IconLogout,
} from "@/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Hub", Icon: IconHome },
  { href: "/admin/planning", label: "Planning", Icon: IconCalendar },
  { href: "/admin/prestations", label: "Prestations", Icon: IconSprinkler },
  { href: "/admin/categories", label: "Catégories", Icon: IconFolder },
  { href: "/admin/equipe", label: "Équipe", Icon: IconTeam },
  { href: "/admin/clienteles", label: "Clientèles", Icon: IconClients },
  { href: "/admin/finances", label: "Finances", Icon: IconWallet },
  { href: "/admin/horaires", label: "Horaires", Icon: IconClock },
  { href: "/admin/notifications", label: "Notifications", Icon: IconBell },
  { href: "/admin/profil", label: "Mon profil", Icon: IconProfile },
];

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [deconnexion, setDeconnexion] = useState(false);

  async function handleSignout() {
    setDeconnexion(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <aside className="hidden md:flex md:flex-col md:sticky md:top-0 md:left-0 md:h-screen md:w-64 md:border-r md:bg-white">
      <div className="border-b p-6">
        <Link href="/" className="text-lg tracking-wide" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
          Salon Muse
        </Link>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Espace gérante
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {NAV_ITEMS.map((item) => {
          const actif =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-2.5 text-[13px] font-medium tracking-wide transition-smooth"
              style={{
                background: actif ? "var(--foreground)" : "transparent",
                color: actif ? "var(--background)" : "var(--foreground)",
              }}
            >
              <item.Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] transition-smooth hover:opacity-70"
          style={{ color: "var(--muted)" }}
        >
          <IconLogout className="h-4 w-4 rotate-180" />
          <span>Retour au site</span>
        </Link>
        <button
          onClick={handleSignout}
          disabled={deconnexion}
          className="mt-2 flex w-full items-center gap-2 text-[13px] text-left transition-smooth hover:opacity-70 disabled:opacity-50"
          style={{ color: "#b91c1c" }}
        >
          <IconLogout className="h-4 w-4" />
          <span>{deconnexion ? "Déconnexion…" : "Se déconnecter"}</span>
        </button>
      </div>
    </aside>
  );
}
