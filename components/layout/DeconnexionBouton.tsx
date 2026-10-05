"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeconnexionBouton() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleSignout() {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignout}
      disabled={loading}
      className="w-full py-3 rounded-full text-sm border transition hover:bg-red-50 disabled:opacity-50"
      style={{ borderColor: "#fecaca", color: "#b91c1c" }}
    >
      {loading ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
