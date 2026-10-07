"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: boolean;
}

export function StatCard({ label, value, icon, accent = false }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-smooth">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
            {label}
          </p>
          <p
            className={`text-3xl font-light mt-0.5 ${accent ? "font-normal" : ""}`}
            style={accent ? { color: "var(--foreground)" } : undefined}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatCardStacked({
  label,
  value,
  icon,
  accent = false,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-smooth">
      <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <div className="flex items-end justify-between mt-1">
        <p
          className={`text-3xl font-light ${accent ? "font-normal" : ""}`}
          style={accent ? { color: "var(--foreground)" } : undefined}
        >
          {value}
        </p>
        <span className="text-2xl" aria-hidden>{icon}</span>
      </div>
    </div>
  );
}
