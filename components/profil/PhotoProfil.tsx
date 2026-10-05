"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  prenom: string | null;
  photoUrl: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
};

const SIZES = {
  sm: { px: 48, text: "text-base" },
  md: { px: 80, text: "text-2xl" },
  lg: { px: 120, text: "text-4xl" },
};

export function PhotoProfil({
  userId,
  prenom,
  photoUrl,
  size = "md",
  editable = false,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(photoUrl);

  const sizeConf = SIZES[size];
  const initiale = (prenom?.[0] ?? "?").toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErreur("La photo ne doit pas dépasser 5 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErreur("Seules les images sont acceptées");
      return;
    }

    setErreur(null);
    setLoading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_id", userId);

      const res = await fetch("/api/profil/photo", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setPreview(json.url);
      router.refresh();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur");
      setPreview(photoUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <div
        className="rounded-full overflow-hidden flex items-center justify-center text-white font-medium flex-shrink-0"
        style={{
          width: sizeConf.px,
          height: sizeConf.px,
          background: preview ? "transparent" : "#222222",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt={prenom ?? "Photo"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={sizeConf.text}>{initiale}</span>
        )}
      </div>

      {editable && (
        <>
          <button
            onClick={() => !loading && inputRef.current?.click()}
            disabled={loading}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#e0dcd3] flex items-center justify-center shadow-sm hover:shadow-md transition disabled:opacity-50"
            title="Changer la photo"
          >
            {loading ? "⏳" : "📷"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}

      {erreur && (
        <p
          className="absolute top-full mt-1 text-xs whitespace-nowrap"
          style={{ color: "#b91c1c" }}
        >
          {erreur}
        </p>
      )}
    </div>
  );
}
