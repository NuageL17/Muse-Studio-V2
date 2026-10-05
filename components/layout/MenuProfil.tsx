"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  IconProfile,
  IconCalendar,
  IconStar,
  IconSparkle,
  IconLogout,
  IconArrowRight,
} from "@/components/ui/icons";

type Props = { prenom: string | null; pointsFidelite: number };

export function MenuProfil({ prenom, pointsFidelite }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  async function handleSignout() {
    setBusy(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const initiale = (prenom?.[0] ?? "?").toUpperCase();
  const items = [
    { href: "/mon-compte/profil", label: "Mon compte", Icon: IconProfile },
    { href: "/mon-compte", label: "Mes rendez-vous", Icon: IconCalendar },
    { href: "/mon-compte/fidelite", label: "Fidélité & Parrainage", Icon: IconStar },
    { href: "/mon-compte/beauty-profile", label: "Beauty Profile", Icon: IconSparkle },
  ];

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80 transition-smooth"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium text-white" style={{ background: "linear-gradient(135deg, #222, #d9c8b8)" }}>
          {initiale}
        </div>
        <IconArrowRight className="h-4 w-4" style={{ color: "var(--muted)", transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 200ms var(--ease-muse)" } as React.CSSProperties} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl z-50 border shadow-lg bg-white" style={{ borderColor: "#e0dcd3" }}>
          <div className="p-4 border-b" style={{ borderColor: "#e0dcd3" }}>
            <p className="text-sm font-medium text-[#222]">Bonjour {prenom ?? ""}</p>
            <p className="mt-0.5 text-xs" style={{ color: "#6b6b6b" }}>{pointsFidelite} point{pointsFidelite > 1 ? "s" : ""} fidélité</p>
          </div>
          <div className="py-1">
            {items.map((it) => (
              <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/[0.03] text-[#222]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#f5f3ee" }}><it.Icon className="h-4 w-4" /></span>
                {it.label}
              </Link>
            ))}
          </div>
          <div className="border-t" style={{ borderColor: "#e0dcd3" }}>
            <button onClick={handleSignout} disabled={busy} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-red-50 disabled:opacity-50 min-h-[44px]" style={{ color: "#b91c1c" }}>
              <IconLogout className="h-4 w-4" />
              {busy ? "Déconnexion…" : "Se déconnecter"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
