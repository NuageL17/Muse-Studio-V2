import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BeautyProfileForm } from "@/components/profil/BeautyProfileForm";
import { PhotoProfil } from "@/components/profil/PhotoProfil";
import { SectionLabel, Card3xl } from "@/components/cliente/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BeautyProfileClientePage() {
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
          <Link href="/mon-compte" className="text-sm hover:opacity-60" style={{ color: "#6b6b6b" }}>← Mon compte</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20 muse-fade-in">
        <SectionLabel text="Mon espace" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.05em] leading-[0.86] text-[#222222] mb-8">Mon Beauty Profile</h1>

        <div className="flex items-start gap-5 mb-8">
          <PhotoProfil userId={user.id} prenom={profile?.prenom ?? null} photoUrl={profile?.photo_profil_url ?? null} size="lg" editable />
          <div>
            <p className="text-xl md:text-2xl font-medium text-[#222222]">{profile?.prenom} {profile?.nom ?? ""}</p>
            <p className="text-sm mt-1" style={{ color: "#6b6b6b" }}>{profile?.telephone ?? "—"}</p>
            <p className="text-xs mt-2" style={{ color: "#6b6b6b" }}>
              Partagez ces informations avec votre esthéticienne pour un soin adapté.
            </p>
          </div>
        </div>

        <Card3xl className="p-7 md:p-9">
          <BeautyProfileForm profil={{
            id: profile?.id ?? user.id,
            prenom: profile?.prenom ?? null,
            nom: profile?.nom ?? null,
            telephone: profile?.telephone ?? null,
            email_contact: profile?.email_contact ?? null,
            date_naissance: profile?.date_naissance ?? null,
            comment_connu: profile?.comment_connu ?? null,
            type_peau: profile?.type_peau ?? null,
            allergies: profile?.allergies ?? null,
            preferences: profile?.preferences ?? null,
            notes_privees: profile?.notes_privees ?? null,
            prochain_soin_recommande: profile?.prochain_soin_recommande ?? null,
            date_prochain_soin: profile?.date_prochain_soin ?? null,
            info_importante: profile?.info_importante ?? null,
            info_signalee_cliente: profile?.info_signalee_cliente ?? null,
            vip: profile?.vip ?? false,
          }} role="cliente" />
        </Card3xl>
      </section>
    </main>
  );
}
