import Link from "next/link";
import { notFound } from "next/navigation";
import { requireGerante } from "@/lib/auth";
import { BeautyProfileForm } from "@/components/profil/BeautyProfileForm";
import { PhotoProfil } from "@/components/profil/PhotoProfil";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  params: Promise<{ id: string }>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateHeure(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
      return { label: "Annulé salon", bg: "#fee2e2", color: "#b91c1c" };
    case "annule_cliente":
      return { label: "Annulé cliente", bg: "#fee2e2", color: "#b91c1c" };
    case "no_show":
      return { label: "No-show", bg: "#fce4ec", color: "#880e4f" };
    case "en_attente":
    default:
      return { label: "En attente", bg: "#fff8e1", color: "#a07900" };
  }
}

export default async function ClienteDetailPage({ params }: Params) {
  const { id } = await params;
  const { supabase } = await requireGerante();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  // Récupérer l'email depuis auth.users
  let emailAuth: string | null = null;
  try {
    const { data: authData } = await supabase.auth.admin.getUserById(id);
    emailAuth = authData?.user?.email ?? null;
  } catch {
    // ignore
  }

  // Historique RDV
  const { data: rdvs } = await supabase
    .from("rendez_vous")
    .select(
      "id, debut, statut, prix_applique, acompte_paye, notes, prestations (nom, categorie, duree_min)"
    )
    .eq("cliente_id", id)
    .order("debut", { ascending: false });

  const listeRdv = rdvs ?? [];
  const rdvTermines = listeRdv.filter((r) => r.statut === "termine");
  const totalDepense = rdvTermines.reduce(
    (sum, r) => sum + (r.prix_applique ?? 0),
    0
  );
  const nbPrestations = rdvTermines.length;
  const dernierRdv = rdvTermines[0] ?? null;
  const prochainRdv = listeRdv
    .filter(
      (r) =>
        new Date(r.debut) > new Date() &&
        ["en_attente", "confirme"].includes(r.statut)
    )
    .sort((a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime())[0];

  // Parrainage
  const { data: parrainage } = await supabase
    .from("parrainages")
    .select("id, statut, parrain_id")
    .eq("filleul_id", id)
    .maybeSingle();

  let parrainProfil: { prenom: string | null; nom: string | null } | null =
    null;
  if (parrainage?.parrain_id) {
    const { data } = await supabase
      .from("profiles")
      .select("prenom, nom")
      .eq("id", parrainage.parrain_id)
      .single();
    parrainProfil = data;
  }

  const { data: filleulsData } = await supabase
    .from("parrainages")
    .select("id, statut, filleul_id")
    .eq("parrain_id", id);

  const filleulIds = (filleulsData ?? []).map((f) => f.filleul_id);
  const { data: profilsFilleuls } = filleulIds.length
    ? await supabase
        .from("profiles")
        .select("id, prenom, nom")
        .in("id", filleulIds)
    : {
        data: [] as {
          id: string;
          prenom: string | null;
          nom: string | null;
        }[],
      };

  // Bonus parrainage et fidélité
  const { data: transactions } = await supabase
    .from("transactions_fidelite")
    .select("id, points, motif, created_at")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  const bonusParrainage = (transactions ?? [])
    .filter((t) => t.motif?.toLowerCase().includes("parrainage"))
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  const bonusFidelite = (transactions ?? [])
    .filter((t) => t.motif === "RDV terminé")
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  // Comment elle nous a connu
  const commentConnuLabels: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    bouche_a_oreille: "Bouche à oreille",
    google: "Google",
    autre: "Autre",
  };

  return (
    <section className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link
        href="/admin/clienteles"
        className="text-sm mb-6 inline-block hover:opacity-60"
        style={{ color: "var(--muted)" }}
      >
        ← Retour aux clientèles
      </Link>

      {/* En-tête */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <PhotoProfil
            userId={profile.id}
            prenom={profile.prenom}
            photoUrl={profile.photo_profil_url}
            size="lg"
            editable={true}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-light mb-2">
              {profile.prenom ?? "—"} {profile.nom ?? ""}
              {profile.vip && (
                <span
                  className="text-xs ml-2 px-2 py-0.5 rounded-full align-middle"
                  style={{ background: "#fff8e1", color: "#a07900" }}
                >
                  👑 VIP
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {profile.telephone ?? "—"}
              {emailAuth && ` · ${emailAuth}`}
            </p>
          </div>
        </div>
      </div>

      {/* RÉSUMÉ */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: "#faf6ef", border: "1px solid #f0e0b0" }}
      >
        <p
          className="text-xs uppercase tracking-wide mb-4"
          style={{ color: "#a07900" }}
        >
          📋 Résumé
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p style={{ color: "var(--muted)" }}>Cliente depuis</p>
            <p className="font-medium">{formatDate(profile.created_at)}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Nombre de visites</p>
            <p className="font-medium">{nbPrestations}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Total dépensé</p>
            <p className="font-medium" style={{ color: "var(--accent-dark)" }}>
              {totalDepense} DA
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Total points</p>
            <p className="font-medium" style={{ color: "var(--accent-dark)" }}>
              {profile.points_fidelite ?? 0}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Prochain RDV</p>
            <p className="font-medium">
              {prochainRdv ? formatDateHeure(prochainRdv.debut) : "—"}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Bonus parrainage</p>
            <p className="font-medium" style={{ color: "#2e7d32" }}>
              +{bonusParrainage} pts
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Bonus fidélité</p>
            <p className="font-medium" style={{ color: "#2e7d32" }}>
              +{bonusFidelite} pts
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Nous a connu via</p>
            <p className="font-medium">
              {profile.comment_connu
                ? commentConnuLabels[profile.comment_connu] ??
                  profile.comment_connu
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* COORDONNÉES + BEAUTY PROFILE */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white mb-6">
        <BeautyProfileForm
          profil={{
            id: profile.id,
            prenom: profile.prenom,
            nom: profile.nom,
            telephone: profile.telephone,
            email_contact: profile.email_contact,
            date_naissance: profile.date_naissance,
            comment_connu: profile.comment_connu,
            type_peau: profile.type_peau,
            allergies: profile.allergies,
            preferences: profile.preferences,
            notes_privees: profile.notes_privees,
            prochain_soin_recommande: profile.prochain_soin_recommande,
            date_prochain_soin: profile.date_prochain_soin,
            vip: profile.vip ?? false,
            info_importante: profile.info_importante ?? null,
            info_signalee_cliente: profile.info_signalee_cliente ?? null,
          }}
          role="gerante"
        />
      </div>

      {/* INFORMATIONS IMPORTANTES */}
      <div className="p-6 rounded-2xl mb-6" style={{ background: "#fff8e1", border: "1px solid #f0e0b0" }}>
        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "#a07900" }}
        >
          ⚠️ Informations importantes
        </p>
        <p className="text-sm whitespace-pre-wrap">
          {profile.info_importante || (
            <span style={{ color: "var(--muted)" }}>
              Aucune information particulière
            </span>
          )}
        </p>
      </div>

      {/* INFORMATIONS SIGNALÉES PAR LA CLIENTE */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: "#e3f2fd", border: "1px solid #bbdefb" }}
      >
        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "#1565c0" }}
        >
          💬 Informations signalées par la cliente
        </p>
        <p className="text-sm whitespace-pre-wrap">
          {profile.info_signalee_cliente || (
            <span style={{ color: "var(--muted)" }}>
              Rien de signalé pour l&apos;instant
            </span>
          )}
        </p>
      </div>

      {/* HISTORIQUE FINANCIER */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white mb-6">
        <p
          className="text-xs uppercase tracking-wide mb-4"
          style={{ color: "var(--muted)" }}
        >
          💰 Historique financier
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
          <div>
            <p style={{ color: "var(--muted)" }}>Total dépensé</p>
            <p
              className="text-xl font-light"
              style={{ color: "var(--accent-dark)" }}
            >
              {totalDepense} DA
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Nombre de prestations</p>
            <p className="text-xl font-light">{nbPrestations}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Dernier paiement</p>
            <p className="text-sm font-medium">
              {dernierRdv
                ? `${dernierRdv.prix_applique} DA — ${formatDate(dernierRdv.debut)}`
                : "—"}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Acompte versé / Solde</p>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              — (à venir)
            </p>
          </div>
        </div>

        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "var(--muted)" }}
        >
          Historique des paiements
        </p>
        {rdvTermines.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Aucun paiement enregistré.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rdvTermines.slice(0, 20).map((r) => {
              const p = r.prestations as unknown as {
                nom: string;
              } | null;
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 text-sm"
                >
                  <div>
                    <p className="font-medium">{p?.nom ?? "—"}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {formatDate(r.debut)}
                    </p>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: "var(--accent-dark)" }}
                  >
                    {r.prix_applique} DA
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parrainage */}
      {(parrainProfil || (filleulsData && filleulsData.length > 0)) && (
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white mb-6">
          <p
            className="text-xs uppercase tracking-wide mb-4"
            style={{ color: "var(--muted)" }}
          >
            🎁 Parrainage
          </p>

          {parrainProfil && (
            <div className="mb-4">
              <p className="text-sm">
                <span style={{ color: "var(--muted)" }}>
                  Parrainée par :{" "}
                </span>
                {parrainProfil.prenom} {parrainProfil.nom}
              </p>
            </div>
          )}

          {filleulsData && filleulsData.length > 0 && (
            <div>
              <p className="text-sm mb-2">
                A parrainé {filleulsData.length} personne
                {filleulsData.length > 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {filleulsData.map((f) => {
                  const p = profilsFilleuls?.find((x) => x.id === f.filleul_id);
                  return (
                    <div
                      key={f.id}
                      className="flex items-center justify-between text-sm p-2 rounded-lg bg-neutral-50"
                    >
                      <span>
                        {p?.prenom ?? "?"} {p?.nom ?? ""}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            f.statut === "valide" ? "#e8f5e9" : "#fff8e1",
                          color:
                            f.statut === "valide" ? "#2e7d32" : "#a07900",
                        }}
                      >
                        {f.statut === "valide" ? "Validé" : "En attente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historique RDV */}
      <h2 className="text-xl font-light mb-4">Historique des RDV</h2>
      {listeRdv.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-neutral-300 text-center mb-8">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Aucun rendez-vous pour cette cliente.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {listeRdv.map((r) => {
            const badge = badgeStatut(r.statut);
            const p = r.prestations as unknown as {
              nom: string;
              categorie: string | null;
              duree_min: number;
            } | null;
            return (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{p?.nom ?? "—"}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {formatDateHeure(r.debut)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block text-xs px-2 py-1 rounded-full mb-1"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--accent-dark)" }}
                  >
                    {r.prix_applique} DA
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}