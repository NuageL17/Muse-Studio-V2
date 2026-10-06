import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MuseBackground from "@/components/home/MuseBackground";
import Hero from "@/components/home/Hero";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { role: string; prenom: string | null; points_fidelite: number | null } | null = null;
  if (user) {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles").select("role, prenom, points_fidelite").eq("id", user.id).single();
    profile = data;
    if (profile?.role === "travailleuse") redirect("/travailleuse");
  }

  const estConnectee = !!user && profile?.role === "cliente";
  const role = (profile?.role ?? "cliente") as "cliente" | "travailleuse" | "gerante";

  return (
    <>
      <MuseBackground />
      <main className="hero-page">
        <Hero prenom={profile?.prenom ?? null} pointsFidelite={profile?.points_fidelite ?? 0} estConnectee={estConnectee} />
        {user && <BottomTabBar role={role} />}
      </main>
    </>
  );
}
