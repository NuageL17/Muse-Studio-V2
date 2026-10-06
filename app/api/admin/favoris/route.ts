import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { href } = body as { href?: string };

  if (!href) {
    return NextResponse.json({ error: "href manquant" }, { status: 400 });
  }

  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("role, sections_favorites")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "gerante") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const current: string[] = profile.sections_favorites ?? [];
  const newFavoris = current.includes(href)
    ? current.filter((h) => h !== href)
    : [...current, href];

  const { error } = await admin
    .from("profiles")
    .update({ sections_favorites: newFavoris })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favoris: newFavoris });
}