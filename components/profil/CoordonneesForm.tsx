"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  profil: {
    id: string;
    prenom: string | null;
    nom: string | null;
    telephone: string | null;
    email_contact: string | null;
    date_naissance: string | null;
  };
};

export function CoordonneesForm({ profil }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    prenom: profil.prenom ?? "",
    nom: profil.nom ?? "",
    telephone: profil.telephone ?? "",
    email_contact: profil.email_contact ?? "",
    date_naissance: profil.date_naissance ?? "",
  });

  async function sauvegarder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur(null);
    setOk(false);

    try {
      const res = await fetch("/api/cliente/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setOk(true);
      router.refresh();
      setTimeout(() => setOk(false), 3000);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={sauvegarder} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-2 font-medium text-[#222222]">Prénom</label>
          <input
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all"
            style={{ borderColor: "#e0dcd3" }}
          />
        </div>
        <div>
          <label className="block text-sm mb-2 font-medium text-[#222222]">Nom</label>
          <input
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all"
            style={{ borderColor: "#e0dcd3" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">Téléphone</label>
        <input
          type="tel"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all"
          style={{ borderColor: "#e0dcd3" }}
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">
          Email <span style={{ color: "#6b6b6b" }}>(facultatif)</span>
        </label>
        <input
          type="email"
          value={form.email_contact}
          onChange={(e) =>
            setForm({ ...form, email_contact: e.target.value })
          }
          className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all"
          style={{ borderColor: "#e0dcd3" }}
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">Date de naissance</label>
        <input
          type="date"
          value={form.date_naissance}
          onChange={(e) =>
            setForm({ ...form, date_naissance: e.target.value })
          }
          className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all"
          style={{ borderColor: "#e0dcd3" }}
        />
      </div>

      {erreur && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {erreur}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full text-white text-sm font-medium disabled:opacity-50 shadow-sm transition-all hover:opacity-90"
          style={{ background: "#222222" }}
        >
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
        {ok && (
          <span className="text-sm" style={{ color: "#2e7d32" }}>
            ✅ Enregistré
          </span>
        )}
      </div>
    </form>
  );
}
