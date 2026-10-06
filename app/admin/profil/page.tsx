import Link from "next/link";
import { requireGerante } from "@/lib/auth";
import { PhotoProfil } from "@/components/profil/PhotoProfil";
import { DeconnexionBouton } from "@/components/layout/DeconnexionBouton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProfilPage() {
  const { user, profile } = await requireGerante();

  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto">
      <p
        className="text-sm tracking-[0.2em] uppercase mb-2"
        style={{ color: "var(--muted)" }}
      >
        Mon compte
      </p>
      <h1 className="text-4xl font-light mb-8">Mon profil</h1>

      <div className="flex items-start gap-5 mb-8">
        <PhotoProfil
          userId={user.id}
          prenom={profile?.prenom ?? null}
          photoUrl={profile?.photo_profil_url ?? null}
          size="lg"
          editable={true}
        />
        <div>
          <p className="text-lg font-medium">
            {profile?.prenom} {profile?.nom ?? ""}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {profile?.telephone ?? "Pas de téléphone"}
          </p>
          <span
            className="inline-block text-xs mt-2 px-2 py-0.5 rounded-full"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Gérante
          </span>
        </div>
      </div>

      <div
        className="p-6 rounded-2xl border mb-6"
        style={{ borderColor: "var(--border)", background: "white" }}
      >
        <p
          className="text-xs uppercase tracking-wide mb-4"
          style={{ color: "var(--muted)" }}
        >
          Informations
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Prénom</span>
            <span>{profile?.prenom ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Nom</span>
            <span>{profile?.nom ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Téléphone</span>
            <span>{profile?.telephone ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <DeconnexionBouton />
      </div>
    </section>
  );
}