import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Prestation } from "@/lib/types/database";
import { ReservationWizard } from "./ReservationWizard";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Categorie = {
  id: string;
  nom: string;
  parent_id: string | null;
  ordre_affichage: number;
};

export default async function ReservationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "travailleuse") {
    redirect("/travailleuse");
  }

  if (profile?.role === "gerante") {
    redirect("/admin");
  }

  const role = (profile?.role ?? "cliente") as "cliente" | "travailleuse" | "gerante";

  const { data: prestations } = await admin
    .from("prestations")
    .select("*")
    .eq("actif", true)
    .order("ordre_affichage");

  const { data: categories } = await admin
    .from("categories")
    .select("id, nom, parent_id, ordre_affichage")
    .order("ordre_affichage", { ascending: true });

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <div className="muse-bg" aria-hidden>
        <div className="muse-bg__glow" />
        <div className="muse-bg__grain" />
      </div>

      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md" style={{ borderColor: "var(--color-border)" }}>
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-[17px] font-semibold tracking-tight" style={{ color: "var(--color-charcoal)" }}>
            Muse<span style={{ fontWeight: 300 }}>.</span>
          </Link>
          <Link href="/mon-compte" className="text-xs tracking-wide rounded-full border px-3.5 py-1.5 transition-smooth hover:opacity-80" style={{ color: "var(--color-muted)", borderColor: "var(--color-border)", background: "white" }}>
            Mon compte
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <p className="text-center text-[11px] tracking-[0.18em] uppercase font-semibold mb-3" style={{ color: "var(--color-muted)" }}>
          Réservation
        </p>
        <h1 className="text-center text-[32px] md:text-[36px] font-light tracking-tight leading-none mb-10" style={{ color: "var(--color-charcoal)" }}>
          Prenez rendez-vous
        </h1>

        <ReservationWizard
          prestations={
            (prestations ?? []) as unknown as (Prestation & {
              categorie_id: string | null;
            })[]
          }
          categories={(categories ?? []) as Categorie[]}
        />
      </section>

      <BottomTabBar role={role} />
    </main>
  );
}
