import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifierGerante() {
  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "gerante") return null;
  return { admin, user };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifierGerante();
  if (!auth) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowedFields = [
    "prenom",
    "nom",
    "telephone",
    "email_contact",
    "date_naissance",
    "comment_connu",
    "type_peau",
    "allergies",
    "preferences",
    "notes_privees",
    "prochain_soin_recommande",
    "date_prochain_soin",
    "info_importante",
    "vip",
  ];

  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
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

  // Si on modifie le beauty profile pour la 1ère fois, marquer la date
  if (
    !updates.date_creation_beauty_profile &&
    ("type_peau" in updates ||
      "allergies" in updates ||
      "preferences" in updates)
  ) {
    const { data: current } = await auth.admin
      .from("profiles")
      .select("date_creation_beauty_profile")
      .eq("id", id)
      .single();

    if (current && !current.date_creation_beauty_profile) {
      updates.date_creation_beauty_profile = new Date().toISOString();
    }
  }

  const { error } = await auth.admin
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifierGerante();
  if (!auth) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;

  const { count } = await auth.admin
    .from("rendez_vous")
    .select("*", { count: "exact", head: true })
    .eq("cliente_id", id)
    .gte("debut", new Date().toISOString())
    .in("statut", ["en_attente", "confirme"]);

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: `${count} RDV à venir pour cette cliente.` },
      { status: 409 }
    );
  }

  const { error } = await auth.admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}