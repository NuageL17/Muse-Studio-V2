import { requireGerante } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireGerante();
  const favoris = (profile?.sections_favorites ?? []) as string[];

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">{children}</div>
      <BottomTabBar role="gerante" favoris={favoris} />
    </div>
  );
}