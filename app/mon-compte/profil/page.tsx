import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CoordonneesForm } from "@/components/profil/CoordonneesForm";
import { PhotoProfil } from "@/components/profil/PhotoProfil";
import { DeconnexionBouton } from "@/components/layout/DeconnexionBouton";
import { SectionLabel, Card3xl } from "@/components/cliente/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilClientePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single();

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "#e0dcd3" }}>
        <nav className="mx-auto max-w-3xl flex items-center justify-between p-6">
          <Link href="/" className="text-xl font-medium tracking-tight text-[#222222]">Salon Muse</Link>
          <Link href="/mon-compte" className="text-sm hover:opacity-60" style={{ color: "#6b6b6b" }}>← Mes RDV</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20 muse-fade-in">
        <SectionLabel text="Mon compte" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.05em] leading-[0.86] text-[#222222] mb-10">Mes coordonnées</h1>

        <div className="flex items-start gap-5 mb-8">
          <PhotoProfil userId={user.id} prenom={profile?.prenom ?? null} photoUrl={profile?.photo_profil_url ?? null} size="lg" editable />
          <div>
            <p className="text-xl md:text-2xl font-medium text-[#222222]">{profile?.prenom} {profile?.nom ?? ""}</p>
            <p className="text-sm mt-2" style={{ color: "#6b6b6b" }}>Ces informations restent confidentielles.</p>
          </div>
        </div>

        <Card3xl className="p-7 md:p-9 mb-6">
          <CoordonneesForm profil={{
            id: profile?.id ?? user.id,
            prenom: profile?.prenom ?? null,
            nom: profile?.nom ?? null,
            telephone: profile?.telephone ?? null,
            email_contact: profile?.email_contact ?? null,
            date_naissance: profile?.date_naissance ?? null,
          }} />
        </Card3xl>

        <Link href="/mon-compte/beauty-profile" className="block p-6 md:p-7 rounded-3xl border bg-white shadow-sm transition hover:-translate-y-[2px] hover:shadow-md mb-6" style={{ borderColor: "#e0dcd3" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-[#222222] mb-1">✨ Mon Beauty Profile</p>
              <p className="text-sm" style={{ color: "#6b6b6b" }}>Type de peau, allergies, préférences…</p>
            </div>
            <span className="text-2xl text-[#222222] opacity-60">→</span>
          </div>
        </Link>

        <div className="pt-6 border-t" style={{ borderColor: "#e0dcd3" }}>
          <DeconnexionBouton />
        </div>
      </section>
    </main>
  );
}
