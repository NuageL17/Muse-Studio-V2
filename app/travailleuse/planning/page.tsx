import Link from "next/link";
import { requireTravailleuse } from "@/lib/auth";
import { ActionsTravailleuse } from "@/components/rdv/ActionsTravailleuse";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RdvTravailleuse = {
  id: string;
  cliente_id: string;
  debut: string;
  fin: string;
  statut: string;
  prix_applique: number | null;
  notes: string | null;
  reference_photo_url: string | null;
  clientes: {
    prenom: string | null;
    nom: string | null;
    telephone: string | null;
  } | null;
  prestations: {
    nom: string;
    categorie: string | null;
    duree_min: number;
  } | null;
};

function formatDateHeure(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function badgeStatut(statut: string): {
  label: string;
  bg: string;
  color: string;
} {
  switch (statut) {
    case "confirme":
      return { label: "Confirmé", bg: "#e8f5e9", color: "#2e7d32" };
    case "termine":
      return { label: "Terminé", bg: "#e3f2fd", color: "#1565c0" };
    case "annule_salon":
      return { label: "Annulé", bg: "#fee2e2", color: "#b91c1c" };
    case "annule_cliente":
      return { label: "Annulé (cliente)", bg: "#fee2e2", color: "#b91c1c" };
    case "en_attente":
    default:
      return { label: "En attente", bg: "#fff8e1", color: "#a07900" };
  }
}

export default async function PlanningTravailleusePage() {
  const { supabase, user } = await requireTravailleuse();

  const { data: rdvs } = await supabase
    .from("rendez_vous")
    .select(
      "id, cliente_id, debut, fin, statut, prix_applique, notes, reference_photo_url, clientes:profiles!rendez_vous_cliente_id_fkey (prenom, nom, telephone), prestations (nom, categorie, duree_min)"
    )
    .eq("praticienne_id", user.id)
    .in("statut", ["en_attente", "confirme"])
    .gte("debut", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order("debut", { ascending: true });

  const { data: rdvsAnnules } = await supabase
    .from("rendez_vous")
    .select(
      "id, cliente_id, debut, fin, statut, prix_applique, notes, reference_photo_url, clientes:profiles!rendez_vous_cliente_id_fkey (prenom, nom, telephone), prestations (nom, categorie, duree_min)"
    )
    .eq("praticienne_id", user.id)
    .in("statut", ["annule_salon", "annule_cliente"])
    .gte("debut", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("debut", { ascending: false });

  const liste = (rdvs ?? []) as unknown as RdvTravailleuse[];
  const listeAnnules = (rdvsAnnules ?? []) as unknown as RdvTravailleuse[];

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <nav className="mx-auto max-w-5xl flex items-center justify-between p-6">
          <Link
            href="/travailleuse"
            className="text-xl font-medium tracking-wide"
          >
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

      <section className="mx-auto max-w-5xl px-6 py-10">
        <p
          className="text-sm tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--muted)" }}
        >
          Mon planning
        </p>
        <h1 className="text-4xl font-light mb-8">Mes rendez-vous</h1>

        <h2 className="text-xl font-light mb-4">À venir</h2>
        {liste.length === 0 ? (
          <div
            className="p-8 rounded-2xl border text-center mb-12"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Aucun rendez-vous à venir.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {liste.map((rdv) => (
              <RdvCarte key={rdv.id} rdv={rdv} />
            ))}
          </div>
        )}

        {listeAnnules.length > 0 && (
          <>
            <h2
              className="text-xl font-light mb-4"
              style={{ color: "var(--muted)" }}
            >
              Annulés récemment
            </h2>
            <div className="space-y-3">
              {listeAnnules.map((rdv) => (
                <RdvCarte key={rdv.id} rdv={rdv} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function RdvCarte({ rdv }: { rdv: RdvTravailleuse }) {
  const badge = badgeStatut(rdv.statut);
  const estAnnule = ["annule_salon", "annule_cliente"].includes(rdv.statut);

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{
        borderColor: "var(--border)",
        background: "white",
        opacity: estAnnule ? 0.6 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-shrink-0 w-28">
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            {formatDateHeure(rdv.debut)}
          </p>
          <p className="text-sm mt-1">{rdv.prestations?.duree_min} min</p>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-xs uppercase tracking-wide mb-1"
            style={{ color: "var(--muted)" }}
          >
            {rdv.prestations?.categorie}
          </p>
          <h3 className="text-lg mb-1">
            {rdv.prestations?.nom ?? "Prestation"}
          </h3>

          {rdv.clientes && (
            <Link
              href={`/travailleuse/clientes/${rdv.cliente_id}`}
              className="text-sm hover:opacity-70 inline-flex items-center gap-1"
              style={{ color: "var(--accent-dark)" }}
            >
              👤 {rdv.clientes.prenom ?? "?"} {rdv.clientes.nom ?? ""}
              {rdv.clientes.telephone && ` · ${rdv.clientes.telephone}`}
              <span className="text-xs">↗</span>
            </Link>
          )}

          {rdv.notes && (
            <p
              className="text-xs mt-2 italic"
              style={{ color: "var(--muted)" }}
            >
              « {rdv.notes} »
            </p>
          )}
          {rdv.reference_photo_url && (
            <a
              href={rdv.reference_photo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3"
            >
              <img
                src={rdv.reference_photo_url}
                alt="Référence"
                className="w-24 h-24 object-cover rounded-xl border"
                style={{ borderColor: "var(--border)" }}
              />
            </a>
          )}
          {!estAnnule && (
            <ActionsTravailleuse rdvId={rdv.id} statut={rdv.statut} />
          )}
        </div>

        <div className="flex-shrink-0 text-right">
          <p
            className="text-lg font-medium mb-2"
            style={{ color: "var(--accent-dark)" }}
          >
            {rdv.prix_applique} DA
          </p>
          <span
            className="inline-block text-xs px-2 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
      </div>
    </div>
  );
}