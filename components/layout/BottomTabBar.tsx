"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconCalendar,
  IconStar,
  IconSprinkler,
  IconFolder,
  IconTeam,
  IconClients,
  IconWallet,
  IconClock,
  IconBell,
  IconProfile,
} from "@/components/ui/icons";

type Role = "cliente" | "travailleuse" | "gerante";

type Tab = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const TABS_BASE: Record<Role, Tab[]> = {
  cliente: [
    { href: "/", label: "Accueil", Icon: IconHome },
    { href: "/mon-compte", label: "Mes RDV", Icon: IconCalendar },
    { href: "/mon-compte/fidelite", label: "Fidélité", Icon: IconStar },
    { href: "/mon-compte/profil", label: "Compte", Icon: IconProfile },
  ],
  travailleuse: [
    { href: "/travailleuse", label: "Accueil", Icon: IconHome },
    { href: "/travailleuse/planning", label: "Planning", Icon: IconCalendar },
    { href: "/travailleuse/profil", label: "Profil", Icon: IconProfile },
  ],
  gerante: [],
};

const SECTION_TO_TAB: Record<string, Tab> = {
  "/admin/planning": { href: "/admin/planning", label: "Planning", Icon: IconCalendar },
  "/admin/prestations": { href: "/admin/prestations", label: "Soins", Icon: IconSprinkler },
  "/admin/categories": { href: "/admin/categories", label: "Catégories", Icon: IconFolder },
  "/admin/equipe": { href: "/admin/equipe", label: "Équipe", Icon: IconTeam },
  "/admin/clienteles": { href: "/admin/clienteles", label: "Clientes", Icon: IconClients },
  "/admin/finances": { href: "/admin/finances", label: "Finance", Icon: IconWallet },
  "/admin/horaires": { href: "/admin/horaires", label: "Horaires", Icon: IconClock },
  "/admin/notifications": { href: "/admin/notifications", label: "Notifs", Icon: IconBell },
};

const PROFIL_GERANTE: Tab = {
  href: "/admin/profil",
  label: "Profil",
  Icon: IconProfile,
};

type Props = {
  role: Role;
  favoris?: string[];
};

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/mon-compte") return pathname === "/mon-compte";
  if (href === "/travailleuse") return pathname === "/travailleuse";
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomTabBar({ role, favoris = [] }: Props) {
  const pathname = usePathname();

  let tabs: Tab[];

  if (role === "gerante") {
    const accueil: Tab = { href: "/admin", label: "Accueil", Icon: IconHome };
    const favorisTabs = favoris
      .map((href) => SECTION_TO_TAB[href])
      .filter(Boolean);
    tabs = [accueil, ...favorisTabs, PROFIL_GERANTE];
  } else {
    tabs = TABS_BASE[role];
  }

  if (tabs.length === 0) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t"
      style={{
        borderColor: "#e0dcd3",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
        minHeight: "calc(4rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.href, pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center flex-1 transition-smooth"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full transition-smooth"
                style={{
                  background: active ? "#222222" : "transparent",
                }}
              >
                <tab.Icon
                  className="h-5 w-5"
                  {...({
                    style: { color: active ? "#f5f3ee" : "#6b6b6b" },
                  } as any)}
                />
              </span>
              <span
                className="mt-0.5 text-[10px] tracking-wide"
                style={{
                  color: active ? "#222222" : "#6b6b6b",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute bottom-1.5 h-1 w-1 rounded-full"
                  style={{ background: "#222222" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
