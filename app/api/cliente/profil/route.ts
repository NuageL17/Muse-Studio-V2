import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CHAMPS_AUTORISES = [
  "prenom",
  "nom",
  "telephone",
  "email_contact",
  "date_naissance",
  "type_peau",
  "allergies",
  "preferences",
  "info_signalee_cliente",
];

export async function PATCH(request: Request) {
  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
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
      { error: "Aucun champ à mettre à jour" },
      { status: 400 }
    );
  }

  if (
    "type_peau" in updates ||
    "allergies" in updates ||
    "preferences" in updates
  ) {
    const { data: current } = await admin
      .from("profiles")
      .select("date_creation_beauty_profile")
      .eq("id", user.id)
      .single();

    if (current && !current.date_creation_beauty_profile) {
      updates.date_creation_beauty_profile = new Date().toISOString();
    }
  }

  const { error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
