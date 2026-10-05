import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MonCompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "cliente") as
    | "cliente"
    | "travailleuse"
    | "gerante";

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      <div className="pb-20 md:pb-0">{children}</div>
      <BottomTabBar role={role} />
    </div>
  );
}
