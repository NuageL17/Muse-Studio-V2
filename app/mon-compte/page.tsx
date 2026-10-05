import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AnnulerRdvButton } from "@/components/rdv/AnnulerRdvButton";
import { ActiverPush } from "@/components/notifications/ActiverPush";
import { PhotoProfil } from "@/components/profil/PhotoProfil";
import { StatusPill, Card3xl, SectionLabel, CtaButton } from "@/components/cliente/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RdvAvecPrestation = {
  id: string;
  debut: string;
  fin: string;
  statut: string;
  prix_applique: number | null;
  notes: string | null;
  reference_photo_url: string | null;
  travailleuse: { prenom: string | null; nom: string | null } | null;
  prestations: { nom: string; categorie: string | null; duree_min: number } | null;
};

function formatDateHeure(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function MonComptePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single();
  const { data: rdvs } = await admin
    .from("rendez_vous")
    .select("id, debut, fin, statut, prix_applique, notes, reference_photo_url, travailleuse:profiles!rendez_vous_praticienne_id_fkey (prenom, nom), prestations (nom, categorie, duree_min)")
    .eq("cliente_id", user.id)
    .in("statut", ["en_attente", "confirme", "en_cours"])
    .gte("debut", new Date().toISOString())
    .order("debut", { ascending: true });

  const prochains = (rdvs ?? []) as unknown as RdvAvecPrestation[];

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "#e0dcd3" }}>
        <nav className="mx-auto max-w-3xl flex items-center justify-between p-6">
          <Link href="/" className="text-xl font-medium tracking-tight text-[#222222]">Salon Muse</Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm hover:opacity-60" style={{ color: "#6b6b6b" }}>Se déconnecter</button>
          </form>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="flex items-center gap-5 mb-12 muse-fade-in">
          <PhotoProfil userId={user.id} prenom={profile?.prenom ?? null} photoUrl={profile?.photo_profil_url ?? null} size="lg" editable />
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-1 font-medium" style={{ color: "#6b6b6b" }}>Espace cliente</p>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#222222]">Bonjour {profile?.prenom ?? user.email}</h1>
            {profile?.vip && (
              <span className="inline-block text-[11px] mt-2 px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#fff8e1", color: "#a07900" }}>
                👑 Cliente VIP
              </span>
            )}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#222222]">Mes prochains RDV</h2>
            <CtaButton href="/reservation">+ Réserver</CtaButton>
          </div>

          {prochains.length === 0 ? (
            <Card3xl className="p-10 text-center">
              <p className="text-[#222222] font-medium mb-2">Aucun rendez-vous à venir.</p>
              <Link href="/reservation" className="text-sm underline hover:opacity-60" style={{ color: "#222" }}>Réserver un soin</Link>
            </Card3xl>
          ) : (
            <div className="space-y-4">
              {prochains.map((rdv, i) => (
                <div key={rdv.id} className="bg-white border rounded-2xl shadow-sm p-6 md:p-7 transition-all hover:-translate-y-[2px] hover:shadow-md muse-fade-in" style={{ borderColor: "#e0dcd3", animationDelay: `${i * 70}ms` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase mb-1 font-medium" style={{ color: "#6b6b6b" }}>
                        {rdv.prestations?.categorie ?? "Soin"}
                      </p>
                      <h3 className="text-lg md:text-xl font-medium text-[#222222]">{rdv.prestations?.nom ?? "Prestation"}</h3>
                    </div>
                    <StatusPill statut={rdv.statut} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#6b6b6b" }}>
                    {formatDateHeure(rdv.debut)} · {rdv.prestations?.duree_min} min
                  </p>
                  <p className="text-sm mb-3" style={{ color: "#6b6b6b" }}>
                    💅 Avec {rdv.travailleuse?.prenom ?? "—"} {rdv.travailleuse?.nom ?? ""}
                  </p>
                  {rdv.prix_applique != null && (
                    <p className="text-base font-extrabold tracking-tight text-[#222222]">{rdv.prix_applique} DA</p>
                  )}
                  {rdv.notes && (
                    <p className="text-xs mt-3 italic" style={{ color: "#6b6b6b" }}>
                      « {rdv.notes} »
                    </p>
                  )}
                  {rdv.reference_photo_url && (
                    <a href={rdv.reference_photo_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
                      <img src={rdv.reference_photo_url} alt="Référence" className="w-20 h-20 object-cover rounded-xl border" style={{ borderColor: "#e0dcd3" }} />
                    </a>
                  )}
                  <AnnulerRdvButton rdvId={rdv.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-2">
          <SectionLabel text="Notifications" />
          <ActiverPush />
        </div>
      </section>
    </main>
  );
}
