import Link from "next/link";
import { requireTravailleuse } from "@/lib/auth";
import { DeconnexionTravailleuse } from "./DeconnexionTravailleuse";
import { StatCardStacked } from "@/components/ui/StatCard";
import { IconCalendar, IconWallet, IconProfile } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TravailleusePage() {
  const { supabase, user, profile } = await requireTravailleuse();

  let categorieNom = "Sans catégorie";
  if (profile?.categorie_id) {
    const { data: cat } = await supabase
      .from("categories")
      .select("nom")
      .eq("id", profile.categorie_id)
      .single();
    if (cat) categorieNom = cat.nom;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: rdvs } = await supabase
    .from("rendez_vous")
    .select("id, debut, statut, prix_applique")
    .eq("praticienne_id", user.id)
    .in("statut", ["en_attente", "confirme"])
    .gte("debut", today.toISOString());

  const liste = rdvs ?? [];
  const rdvAujourdhui = liste.filter((r) => {
    const d = new Date(r.debut);
    return d >= today && d < tomorrow;
  });
  const caPrevisionnel = liste.reduce(
    (sum, r) => sum + (r.prix_applique ?? 0),
    0
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <nav className="mx-auto flex max-w-4xl items-center justify-between p-6">
          <div>
            <Link
              href="/travailleuse"
              className="text-xl font-medium tracking-wide"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}
            >
              Salon Muse
            </Link>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Espace travailleuse
            </p>
          </div>
          <DeconnexionTravailleuse />
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "var(--muted)" }}>
          Bonjour
        </p>
        <h1
          className="text-4xl font-light mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {profile.prenom} {profile.nom ?? ""}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>
          Catégorie :{" "}
          <span className="font-medium" style={{ color: "var(--foreground)" }}>
            {categorieNom}
          </span>
        </p>

        {/* Stats rapides */}
        <div className="grid gap-4 grid-cols-2 mb-12">
          <StatCardStacked icon={<IconCalendar className="h-5 w-5" />} label="RDV aujourd'hui" value={rdvAujourdhui.length} />
          <StatCardStacked icon={<IconWallet className="h-5 w-5" />} label="CA prévisionnel" value={`${caPrevisionnel} DA`} accent />
        </div>

        {/* Accès rapide */}
        <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: "var(--muted)" }}>
          Accès rapide
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/travailleuse/planning"
            className="group relative rounded-2xl border bg-white p-6 transition-smooth hover:border-black"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg mb-3" style={{ background: "var(--background-alt)" }}>
                  <IconCalendar className="h-6 w-6" style={{ color: "var(--foreground)" }} />
                </span>
                <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
                  Mon planning
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Voir tous mes rendez-vous
                </p>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-smooth" style={{ color: "var(--foreground)" }}>
                →
              </span>
            </div>
          </Link>

          <Link
            href="/travailleuse/profil"
            className="group relative rounded-2xl border bg-white p-6 transition-smooth hover:border-black"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg mb-3" style={{ background: "var(--background-alt)" }}>
                  <IconProfile className="h-6 w-6" style={{ color: "var(--foreground)" }} />
                </span>
                <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
                  Mon profil
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Mes stats et mes infos
                </p>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-smooth" style={{ color: "var(--foreground)" }}>
                →
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
