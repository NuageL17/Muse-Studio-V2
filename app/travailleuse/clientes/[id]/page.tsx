import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTravailleuse } from "@/lib/auth";
import { BeautyProfileForm } from "@/components/profil/BeautyProfileForm";
import { PhotoProfil } from "@/components/profil/PhotoProfil";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  params: Promise<{ id: string }>;
};

export default async function TravailleuseClientePage({ params }: Params) {
  const { id } = await params;
  const { supabase } = await requireTravailleuse();

  const { data: cliente } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!cliente) {
    notFound();
  }

  const { data: rdvs } = await supabase
    .from("rendez_vous")
    .select(
      "id, debut, statut, prix_applique, notes, prestations (nom, duree_min)"
    )
    .eq("cliente_id", id)
    .order("debut", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen">
      <header className="border-b border-neutral-200">
        <nav className="mx-auto max-w-4xl flex items-center justify-between p-6">
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
            ← Retour
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* En-tête */}
        <div className="flex items-start gap-5 mb-8 flex-wrap">
          <PhotoProfil
            userId={cliente.id}
            prenom={cliente.prenom}
            photoUrl={cliente.photo_profil_url}
            size="lg"
            editable={true}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-light mb-2">
              {cliente.prenom ?? "—"} {cliente.nom ?? ""}
              {cliente.vip && (
                <span
                  className="text-xs ml-2 px-2 py-0.5 rounded-full align-middle"
                  style={{ background: "#fff8e1", color: "#a07900" }}
                >
                  👑 VIP
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {cliente.telephone ?? "Pas de téléphone"} ·{" "}
              {cliente.points_fidelite ?? 0} points
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--muted)" }}
            >
              ℹ️ Vous pouvez modifier uniquement la fiche Beauty Profile.
              Les coordonnées sont verrouillées.
            </p>
          </div>
        </div>

        {/* Formulaire Beauty Profile */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white mb-6">
          <BeautyProfileForm
            profil={{
              id: cliente.id,
              prenom: cliente.prenom,
              nom: cliente.nom,
              telephone: cliente.telephone,
              date_naissance: cliente.date_naissance,
              type_peau: cliente.type_peau,
              allergies: cliente.allergies,
              preferences: cliente.preferences,
              notes_privees: cliente.notes_privees,
              prochain_soin_recommande: cliente.prochain_soin_recommande,
              date_prochain_soin: cliente.date_prochain_soin,
              vip: cliente.vip,
            }}
            role="travailleuse"
          />
        </div>

        {/* Historique RDV */}
        <h2 className="text-xl font-light mb-4">Historique récent</h2>
        {!rdvs || rdvs.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-neutral-300 text-center">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Aucun RDV pour cette cliente.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rdvs.map((r) => {
              const p = r.prestations as unknown as {
                nom: string;
                duree_min: number;
              } | null;
              return (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{p?.nom}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {new Date(r.debut).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background:
                        r.statut === "termine"
                          ? "#e3f2fd"
                          : r.statut === "confirme"
                            ? "#e8f5e9"
                            : "#fff8e1",
                      color:
                        r.statut === "termine"
                          ? "#1565c0"
                          : r.statut === "confirme"
                            ? "#2e7d32"
                            : "#a07900",
                    }}
                  >
                    {r.statut}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}