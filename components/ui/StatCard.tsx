"use client";
import { ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  accent?: "default" | "rose" | "amber" | "sky";
  onClick?: () => void;
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-[#f5f3ee]",
  rose: "bg-[#fdf2f2]",
  amber: "bg-[#fefbec]",
  sky: "bg-[#f0f9ff]",
};

export default function StatCard({ icon, label, value, change, accent = "default", onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full text-left rounded-[1.5rem] p-5 border border-border/40 bg-${accentMap[accent].slice(1)} hover:scale-[1.01] transition-all shadow-[0_1px_4px_rgba(34,34,34,0.04)]`}
    >
      <div className="w-11 h-11 rounded-full bg-[#f5f3ee] flex items-center justify-center flex-shrink-0 text-charcoal">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted font-medium mb-1">{label}</div>
        <div className="font-inter font-bold text-2xl text-charcoal leading-none">{value}</div>
        {change && <div className="text-xs text-muted mt-0.5">{change}</div>}
      </div>
    </button>
  );
}
