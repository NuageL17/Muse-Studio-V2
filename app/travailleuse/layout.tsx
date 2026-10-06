import { requireTravailleuse } from "@/lib/auth";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TravailleuseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireTravailleuse();

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-20 md:pb-0">{children}</div>
      <BottomTabBar role="travailleuse" />
    </div>
  );
}