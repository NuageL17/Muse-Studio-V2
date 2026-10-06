import Link from "next/link";
import { requireTravailleuse } from "@/lib/auth";
import { PhotoProfil } from "@/components/profil/PhotoProfil";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilTravailleusePage() {
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

  // Stats globales
  const { data: tousRdv } = await supabase
    .from("rendez_vous")
    .select("id, statut, prix_applique, debut")
    .eq("praticienne_id", user.id);

  const rdvTermines = (tousRdv ?? []).filter((r) => r.statut === "termine");
  const caTotal = rdvTermines.reduce(
    (sum, r) => sum + (r.prix_applique ?? 0),
    0
  );
  const rdvAnnules = (tousRdv ?? []).filter((r) =>
    ["annule_salon", "annule_cliente"].includes(r.statut)
  ).length;

  // CA du mois en cours
  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  const rdvMois = rdvTermines.filter((r) => new Date(r.debut) >= debutMois);
  const caMois = rdvMois.reduce((sum, r) => sum + (r.prix_applique ?? 0), 0);

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <nav className="mx-auto max-w-4xl flex items-center justify-between p-6">
          <Link href="/travailleuse" className="text-xl font-medium tracking-wide">
            Salon Muse
          </Link>
          <Link
            href="/travailleuse"
            className="text-sm hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            ← Accueil
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <p
          className="text-sm tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--muted)" }}
        >
          Mon profil
        </p>
        <h1 className="text-4xl font-light mb-8">
          {profile.prenom} {profile.nom ?? ""}
        </h1>

        {/* Identité */}
        <div
          className="p-6 rounded-2xl border mb-6 flex items-center gap-5"
          style={{ borderColor: "var(--border)", background: "white" }}
        >
          <PhotoProfil
            userId={user.id}
            prenom={profile.prenom}
            photoUrl={profile.photo_profil_url}
            size="lg"
            editable={true}
          />
          <div>
            <p className="text-lg font-medium">
              {profile.prenom} {profile.nom ?? ""}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {profile.telephone ?? "Pas de téléphone"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Catégorie : <span className="font-medium">{categorieNom}</span>
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "var(--muted)" }}
        >
          📊 Mes statistiques
        </p>
        <div className="grid gap-4 grid-cols-2 mb-4">
          <div
            className="p-5 rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <p
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: "var(--muted)" }}
            >
              RDV terminés
            </p>
            <p className="text-3xl font-light">{rdvTermines.length}</p>
          </div>
          <div
            className="p-5 rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <p
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: "var(--muted)" }}
            >
              RDV annulés
            </p>
            <p className="text-3xl font-light">{rdvAnnules}</p>
          </div>
          <div
            className="p-5 rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <p
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: "var(--muted)" }}
            >
              CA du mois
            </p>
            <p
              className="text-3xl font-light"
              style={{ color: "var(--accent-dark)" }}
            >
              {caMois} DA
            </p>
          </div>
          <div
            className="p-5 rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <p
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: "var(--muted)" }}
            >
              CA total
            </p>
            <p
              className="text-3xl font-light"
              style={{ color: "var(--accent-dark)" }}
            >
              {caTotal} DA
            </p>
          </div>
        </div>

        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
          Les statistiques sont calculées sur l&apos;ensemble des RDV terminés.
        </p>
      </section>
    </main>
  );
}