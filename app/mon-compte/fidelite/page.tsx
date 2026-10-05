import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card3xl, SectionLabel } from "@/components/cliente/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Filleul = {
  id: string;
  statut: string;
  created_at: string;
  recompense_parrain: number | null;
  filleul: { prenom: string | null; nom: string | null } | null;
};

export default async function FidelitePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single();

  const { data: parrainagesData } = await admin.from("parrainages").select("id, statut, created_at, recompense_parrain, filleul_id").eq("parrain_id", user.id).order("created_at", { ascending: false });
  const filleulIds = (parrainagesData ?? []).map((p) => p.filleul_id);
  const { data: profilsFilleuls } = filleulIds.length
    ? await admin.from("profiles").select("id, prenom, nom").in("id", filleulIds)
    : { data: [] as { id: string; prenom: string | null; nom: string | null }[] };

  const mesFilleuls = (parrainagesData ?? []).map((p) => ({
    id: p.id,
    statut: p.statut,
    created_at: p.created_at,
    recompense_parrain: p.recompense_parrain,
    filleul: profilsFilleuls?.find((f) => f.id === p.filleul_id) ?? null,
  })) as Filleul[];

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "#e0dcd3" }}>
        <nav className="mx-auto max-w-3xl flex items-center justify-between p-6">
          <Link href="/" className="text-xl font-medium tracking-tight text-[#222222]">Salon Muse</Link>
          <Link href="/mon-compte" className="text-sm hover:opacity-60" style={{ color: "#6b6b6b" }}>← Mon compte</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <SectionLabel text="Fidélité" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.05em] leading-[0.86] text-[#222222] mb-10">Mes récompenses</h1>

        <Card3xl className="p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.03] -translate-y-1/3 translate-x-1/4" style={{ background: "#222" }} />
          <p className="text-[11px] tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: "#6b6b6b" }}>Points fidélité</p>
          <p className="text-[6rem] md:text-[8rem] font-extrabold tracking-tighter leading-none text-[#222222]">{profile?.points_fidelite ?? 0}</p>
          <p className="text-sm mt-3" style={{ color: "#6b6b6b" }}>
            1 DA dépensé = 1 point. Cumulez et profitez de réductions exclusives.
          </p>
        </Card3xl>

        <Card3xl className="p-8 md:p-10 mb-8">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-5 font-medium" style={{ color: "#6b6b6b" }}>Mon code de parrainage</p>
          <div className="inline-block px-6 py-4 rounded-2xl border border-dashed border-2" style={{ borderColor: "#e0dcd3" }}>
            <p className="font-mono text-3xl md:text-4xl tracking-[0.15em] text-[#222222] font-bold">{profile?.code_parrainage ?? "—"}</p>
          </div>
          <p className="text-sm mt-5" style={{ color: "#6b6b6b" }}>
            Partagez ce code avec vos amies. Vous gagnez 100 points dès que leur premier soin est terminé.
          </p>
        </Card3xl>

        <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#222222] mb-5">Mes filleuls</h2>
        {mesFilleuls.length === 0 ? (
          <Card3xl className="p-8 text-center">
            <p className="text-sm" style={{ color: "#6b6b6b" }}>Aucun filleul pour l&apos;instant. Partagez votre code à vos amies !</p>
          </Card3xl>
        ) : (
          <div className="space-y-3">
            {mesFilleuls.map((f, i) => (
              <div key={f.id} className="bg-white border rounded-2xl p-6 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md muse-fade-in" style={{ borderColor: "#e0dcd3", animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-[#222222] font-medium">{f.filleul?.prenom ?? "Inconnu"} {f.filleul?.nom ?? ""}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                      {new Date(f.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: f.statut === "valide" ? "#e8f5e9" : "#fff8e1",
                        color: f.statut === "valide" ? "#2e7d32" : "#a07900",
                      }}
                    >
                      {f.statut === "valide" ? "Validé" : "En attente"}
                    </span>
                    {f.statut === "valide" && f.recompense_parrain != null && (
                      <p className="text-xs mt-1 font-bold text-[#222222]">+{f.recompense_parrain} pts</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
