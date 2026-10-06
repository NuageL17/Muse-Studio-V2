import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CHAMPS_AUTORISES = [
  "type_peau",
  "allergies",
  "preferences",
  "notes_privees",
  "prochain_soin_recommande",
  "date_prochain_soin",
  "info_importante",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "travailleuse") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  for (const key of CHAMPS_AUTORISES) {
    if (key in body) {
      const v = body[key];
      updates[key] = v === "" ? null : v;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Aucun champ modifiable fourni" },
      { status: 400 }
    );
  }

  const { error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}