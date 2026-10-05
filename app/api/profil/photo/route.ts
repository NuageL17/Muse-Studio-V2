import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const targetId = formData.get("target_id") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "La photo ne doit pas dépasser 5 MB" },
      { status: 400 }
    );
  }

  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
  const idCible = targetId ?? user.id;

  if (idCible !== user.id) {
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["gerante", "travailleuse"].includes(profile.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${idCible}/${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("photos-profil")
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  const { data: urlData } = admin.storage
    .from("photos-profil")
    .getPublicUrl(fileName);

  const { error: updateError } = await admin
    .from("profiles")
    .update({ photo_profil_url: urlData.publicUrl })
    .eq("id", idCible);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
