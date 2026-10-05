import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Prestation } from "@/lib/types/database";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Card, CtaButton, SectionLabel } from "@/components/cliente/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Categorie = { id: string; nom: string; parent_id: string | null; ordre_affichage: number };
type PrestaAvecCat = Prestation & { categorie_id: string | null };

export default async function PrestationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileRole: string | null = null;
  if (user) {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles").select("role").eq("id", user.id).single();
    profileRole = data?.role ?? null;
  }
  const role = (profileRole ?? "cliente") as "cliente" | "travailleuse" | "gerante";
  const admin = createAdminClient();

  const { data: prestations } = await admin.from("prestations").select("*").eq("actif", true).order("ordre_affichage", { ascending: true });
  const { data: categories } = await admin.from("categories").select("id, nom, parent_id, ordre_affichage").order("ordre_affichage", { ascending: true });

  const listeCat = (categories ?? []) as Categorie[];
  const listePresta = (prestations ?? []) as PrestaAvecCat[];

  function getCatPrincipale(catId: string | null): Categorie | null {
    if (!catId) return null;
    let cur: Categorie | undefined = listeCat.find((c) => c.id === catId);
    while (cur?.parent_id) {
      const parentId: string = cur.parent_id;
      const parent: Categorie | undefined = listeCat.find((c) => c.id === parentId);
      if (!parent) break;
      cur = parent;
    }
    return cur ?? null;
  }

  const principales = listeCat.filter((c) => !c.parent_id).sort((a, b) => a.ordre_affichage - b.ordre_affichage);
  const prestaParPrincipale = new Map<string, PrestaAvecCat[]>();
  for (const p of listePresta) {
    const principale = getCatPrincipale(p.categorie_id);
    if (!principale) continue;
    const arr = prestaParPrincipale.get(principale.id) ?? [];
    arr.push(p);
    prestaParPrincipale.set(principale.id, arr);
  }

  return (
    <main className={`min-h-screen bg-[#f5f3ee] ${user ? "pb-20 md:pb-0" : ""}`}>
      <header className="border-b bg-[#f5f3ee]/80 backdrop-blur-sm sticky top-0 z-30" style={{ borderColor: "#e0dcd3" }}>
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-[15px] font-extrabold tracking-tight text-[#222]">Muse.</Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/prestations" className="text-[#222] font-medium">Prestations</Link>
            <Link href="/reservation" className="hover:opacity-60 text-[#222]">Réserver</Link>
            {user && profileRole ? (
              <Link href={profileRole === "gerante" ? "/admin" : "/mon-compte"} className="hover:opacity-60 text-[#222]">
                {profileRole === "gerante" ? "Dashboard" : "Mon compte"}
              </Link>
            ) : (
              <Link href="/connexion" className="hover:opacity-60 text-[#222]">Connexion</Link>
            )}
            <Link href="/reservation" className="px-5 py-2.5 rounded-full text-white bg-[#222] hover:bg-black transition text-sm font-medium min-h-[44px] inline-flex items-center">
              Prendre RDV
            </Link>
          </div>
          <Link href="/reservation" className="md:hidden px-4 py-2 rounded-full text-white bg-[#222] text-sm font-medium">Réserver</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 md:py-16">
        <SectionLabel text="Nos soins" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.05em] leading-[0.86] mb-3 text-[#222]">Nos prestations</h1>
        <p className="text-[15px] mb-10" style={{ color: "#6b6b6b" }}>
          {listePresta.length} soin{listePresta.length > 1 ? "s" : ""} disponible{listePresta.length > 1 ? "s" : ""}
        </p>

        {principales.length === 0 && listePresta.length === 0 ? (
          <div className="rounded-2xl bg-white border p-10 text-center" style={{ borderColor: "#e0dcd3" }}>
            <p className="text-sm" style={{ color: "#6b6b6b" }}>Aucune prestation pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {principales.map((cat, idx) => {
              const prestas = prestaParPrincipale.get(cat.id) ?? [];
              if (prestas.length === 0) return null;
              return (
                <div key={cat.id} className="muse-fade-in" style={{ animationDelay: `${idx * 70}ms` }}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#222] capitalize">{cat.nom}</h2>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#ebe8e0] text-[#222] font-medium tracking-wide">{prestas.length} soin{prestas.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {prestas.map((p, i) => {
                      const sousCat = listeCat.find((c) => c.id === p.categorie_id && c.parent_id);
                      return (
                        <Card key={p.id} delayMs={i * 50} className="p-6 md:p-7 flex flex-col">
                          {sousCat && <p className="text-[10px] tracking-[0.15em] uppercase mb-2 font-medium" style={{ color: "#6b6b6b" }}>{sousCat.nom}</p>}
                          <h3 className="text-[18px] font-medium text-[#222] mb-2 leading-tight">{p.nom}</h3>
                          <p className="text-sm mb-5 leading-relaxed" style={{ color: "#6b6b6b" }}>{p.description || "Un soin expert pensé pour votre peau."}</p>
                          <div className="flex items-center justify-between pt-4 border-t mt-auto" style={{ borderColor: "#e0dcd3" }}>
                            <span className="text-sm font-medium" style={{ color: "#6b6b6b" }}>{p.duree_min} min</span>
                            <span className="text-2xl font-extrabold tracking-tight text-[#222]">{p.prix} DA</span>
                          </div>
                          <div className="mt-4">
                            <CtaButton href="/reservation" className="w-full">Réserver</CtaButton>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {user && <BottomTabBar role={role} />}
    </main>
  );
}
