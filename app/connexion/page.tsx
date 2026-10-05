"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("muse-email");
    if (saved) setEmail(saved);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const emailValue = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const { data, error } = await supabase.auth.signInWithPassword({ email: emailValue, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (remember) localStorage.setItem("muse-email", emailValue);
    else localStorage.removeItem("muse-email");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    const destination = profile?.role === "gerante" ? "/admin" : profile?.role === "travailleuse" ? "/travailleuse" : "/";
    await new Promise((r) => setTimeout(r, 300));
    window.location.href = destination;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#f5f3ee]">
      <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8 md:p-12 muse-fade-in" style={{ borderColor: "#e0dcd3" }}>
        <Link href="/" className="block text-center text-xl font-medium tracking-tight text-charcoal mb-10">Salon Muse</Link>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.05em] text-[#222222] mb-2 text-center">Connexion</h1>
        <p className="text-sm text-center mb-10" style={{ color: "#6b6b6b" }}>Accédez à votre espace.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium text-[#222222]">Email</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]/10 transition-all"
              style={{ borderColor: "#e0dcd3" }} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-2 font-medium text-[#222222]">Mot de passe</label>
            <input id="password" name="password" type="password" required
              className="w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]/10 transition-all"
              style={{ borderColor: "#e0dcd3" }} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="w-4.5 h-4.5 accent-[#222] rounded border" />
            <span className="text-sm text-[#222222]">Se souvenir de moi</span>
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-full text-white text-base font-medium bg-[#222222] hover:opacity-90 transition-all disabled:opacity-40 shadow-sm">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#6b6b6b" }}>
          Pas encore de compte ?{" "}<Link href="/inscription" className="underline hover:text-[#222222]">Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}
