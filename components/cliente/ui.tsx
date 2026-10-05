"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

/* ---------- Primitives design blanc pur / luxe sobre ---------- */

export function Card({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={`bg-white border rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md ${className}`}
      style={{
        animation: `muse-fade-up 0.45s ease-out both`,
        animationDelay: `${delayMs}ms`,
        borderColor: "#e0dcd3",
      }}
    >
      {children}
    </div>
  );
}

export function Card3xl({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md ${className}`}
      style={{ borderColor: "#e0dcd3" }}
    >
      {children}
    </div>
  );
}

export function CtaButton({
  href,
  children,
  className = "",
  ...rest
}: LinkProps & { children: ReactNode; className?: string }) {
  return (
    <Link
      href={String(href)}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#222222] text-white text-sm font-medium transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function StatusPill({ statut }: { statut: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    confirme: { bg: "#e8f5e9", text: "#2e7d32", label: "Confirmé" },
    en_attente: { bg: "#fff8e1", text: "#a07900", label: "En attente" },
    en_cours: { bg: "#e3f2fd", text: "#1565c0", label: "En cours" },
    annule_cliente: { bg: "#f5f5f5", text: "#757575", label: "Annulé" },
    terminee: { bg: "#f5f5f5", text: "#757575", label: "Terminé" },
  };
  const s = map[statut] ?? map["en_attente"];
  return (
    <span
      className="inline-block text-[11px] px-2.5 py-1 rounded-full font-medium tracking-wide"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

export function SectionLabel({ text }: { text: string }) {
  return (
    <p
      className="text-[11px] tracking-[0.2em] uppercase mb-3 font-medium"
      style={{ color: "#6b6b6b" }}
    >
      {text}
    </p>
  );
}
