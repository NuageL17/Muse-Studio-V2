"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeParrain, setCodeParrain] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const prenom = String(form.get("prenom") ?? "").trim();
    const nom = String(form.get("nom") ?? "").trim();
    const telephone = String(form.get("telephone") ?? "").trim();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom, nom, telephone, code_parrainage: codeParrain.trim().toUpperCase() || null },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#f5f3ee]">
      <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8 md:p-12 muse-fade-in" style={{ borderColor: "#e0dcd3" }}>
        <Link href="/" className="block text-center text-xl font-medium tracking-tight text-[#222222] mb-10">Salon Muse</Link>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.05em] text-[#222222] mb-2 text-center">Créer un compte</h1>
        <p className="text-sm text-center mb-10" style={{ color: "#6b6b6b" }}>Réservez vos soins en 2 clics.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prenom" className="block text-sm mb-2 font-medium text-[#222222]">Prénom</label>
              <input id="prenom" name="prenom" required className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all" style={{ borderColor: "#e0dcd3" }} />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm mb-2 font-medium text-[#222222]">Nom</label>
              <input id="nom" name="nom" required className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all" style={{ borderColor: "#e0dcd3" }} />
            </div>
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm mb-2 font-medium text-[#222222]">Téléphone</label>
            <input id="telephone" name="telephone" type="tel" required placeholder="+213 5XX XX XX XX" className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all" style={{ borderColor: "#e0dcd3" }} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium text-[#222222]">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all" style={{ borderColor: "#e0dcd3" }} />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm mb-2 font-medium text-[#222222]">Code de parrainage <span style={{ color: "#6b6b6b" }}>(optionnel)</span></label>
            <input id="code" name="code_parrainage" value={codeParrain} onChange={(e) => setCodeParrain(e.target.value.toUpperCase())} placeholder="Ex : A3F9B2C1" className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all font-mono tracking-wider" style={{ borderColor: "#e0dcd3" }} />
            <p className="text-xs mt-2" style={{ color: "#6b6b6b" }}>Si une amie vous a parrainée, collez son code ici pour gagner des points.</p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-2 font-medium text-[#222222]">Mot de passe</label>
            <input id="password" name="password" type="password" required minLength={6} className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all" style={{ borderColor: "#e0dcd3" }} />
            <p className="text-xs mt-2" style={{ color: "#6b6b6b" }}>6 caractères minimum</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-full text-white text-base font-medium bg-[#222222] hover:opacity-90 transition-all disabled:opacity-40 shadow-sm">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#6b6b6b" }}>
          Déjà un compte ?{" "}<Link href="/connexion" className="underline hover:text-[#222222]">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
