"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { rdvId: string };

export function AnnulerRdvButton({ rdvId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnnuler() {
    if (!confirm("Annuler ce rendez-vous ? Cette action est définitive.")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rdv/${rdvId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleAnnuler}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 rounded-full text-[13px] border transition-all hover:-translate-y-[1px] hover:shadow-sm disabled:opacity-50"
        style={{
          borderColor: "#222",
          color: "#222",
          background: "transparent",
        }}
      >
        {loading ? "Annulation…" : "Annuler"}
      </button>
      {error && (
        <p className="text-xs mt-2" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
    </div>
  );
}
