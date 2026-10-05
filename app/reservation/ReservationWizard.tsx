"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Prestation } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

type Categorie = {
  id: string;
  nom: string;
  parent_id: string | null;
  ordre_affichage: number;
};

type PrestationAvecCat = Prestation & { categorie_id: string | null };

type Travailleuse = {
  id: string;
  prenom: string;
  nom: string | null;
  categorie_id: string;
};

type Props = {
  prestations: PrestationAvecCat[];
  categories: Categorie[];
};

function formatDateFR(d: Date): string {
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTimeFR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNextDays(n: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

type Etape = "categorie" | "sous-categorie" | "prestation" | "travailleuse" | "creneau" | "confirmation";

export function ReservationWizard({ prestations, categories }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [etape, setEtape] = useState<Etape>("categorie");

  // Sélections
  const [categoriePrincipale, setCategoriePrincipale] = useState<Categorie | null>(null);
  const [sousCategorie, setSousCategorie] = useState<Categorie | null>(null);
  const [prestation, setPrestation] = useState<PrestationAvecCat | null>(null);
  const [travailleuse, setTravailleuse] = useState<Travailleuse | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  // Chargement
  const [travailleuses, setTravailleuses] = useState<Travailleuse[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingTravailleuses, setLoadingTravailleuses] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Confirmation
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = getNextDays(14);

  // Catégories principales
  const principales = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.ordre_affichage - b.ordre_affichage);

  function getSousCategories(parentId: string): Categorie[] {
    return categories
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => a.ordre_affichage - b.ordre_affichage);
  }

  function getPrestationsDansCategorie(catId: string): PrestationAvecCat[] {
    return prestations.filter((p) => p.categorie_id === catId);
  }

  function getAllPrestationsPrincipale(principaleId: string): PrestationAvecCat[] {
    const sousCats = getSousCategories(principaleId).map((c) => c.id);
    const allCatIds = [principaleId, ...sousCats];
    return prestations.filter((p) => p.categorie_id && allCatIds.includes(p.categorie_id));
  }

  // === Sélections — 100% logique backup ===

  function choisirCategoriePrincipale(cat: Categorie) {
    setCategoriePrincipale(cat);
    setSousCategorie(null);
    setPrestation(null);
    const sousCats = getSousCategories(cat.id);
    const prestasDirectes = getPrestationsDansCategorie(cat.id);
    const prestasTotal = getAllPrestationsPrincipale(cat.id);
    if (sousCats.length > 0) {
      setEtape("sous-categorie");
      return;
    }
    if (prestasDirectes.length > 0) {
      setEtape("prestation");
      return;
    }
    if (prestasTotal.length === 0) {
      setError("Aucune prestation dans cette catégorie.");
    }
  }

  function choisirSousCategorie(sub: Categorie | null) {
    setSousCategorie(sub);
    setPrestation(null);
    setEtape("prestation");
  }

  async function choisirPrestation(p: PrestationAvecCat) {
    setPrestation(p);
    setEtape("travailleuse");
    setLoadingTravailleuses(true);
    setError(null);
    setTravailleuse(null);
    try {
      const res = await fetch(`/api/travailleuses?prestation_id=${p.id}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTravailleuses(json.travailleuses ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setTravailleuses([]);
    } finally {
      setLoadingTravailleuses(false);
    }
  }

  function choisirTravailleuse(t: Travailleuse) {
    setTravailleuse(t);
    setEtape("creneau");
    setDate(null);
    setSlots([]);
    setSlot(null);
  }

  async function handleSelectDate(d: Date) {
    if (!prestation || !travailleuse) return;
    setDate(d);
    setSlot(null);
    setLoadingSlots(true);
    setError(null);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    try {
      const res = await fetch(
        `/api/creneaux?prestation_id=${prestation.id}&travailleuse_id=${travailleuse.id}&date=${dateStr}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSlots(json.slots ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Seules les images sont acceptées");
      return;
    }
    setError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function retirerPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile) return null;
    const ext = photoFile.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("references-rdv").upload(fileName, photoFile);
    if (uploadError) throw new Error("Erreur upload photo : " + uploadError.message);
    const { data: urlData } = supabase.storage.from("references-rdv").getPublicUrl(fileName);
    return urlData.publicUrl;
  }

  async function handleConfirm() {
    if (!prestation || !travailleuse || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      let photoUrl: string | null = null;
      if (photoFile) photoUrl = await uploadPhoto();
      const res = await fetch("/api/rdv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prestation_id: prestation.id,
          travailleuse_id: travailleuse.id,
          debut: slot,
          notes: notes.trim() || null,
          reference_photo_url: photoUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push("/mon-compte");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setSubmitting(false);
    }
  }

  // === Progression pills ===
  const etapesActives: Etape[] = ["categorie"];
  if (categoriePrincipale) {
    if (getSousCategories(categoriePrincipale.id).length > 0) {
      etapesActives.push("sous-categorie");
    }
    etapesActives.push("prestation", "travailleuse", "creneau", "confirmation");
  }
  const idx = etapesActives.indexOf(etape);
  const labels: Record<Etape, string> = {
    categorie: "Soin",
    "sous-categorie": "Zone",
    prestation: "Détail",
    travailleuse: "Praticienne",
    creneau: "Créneau",
    confirmation: "Confirmer",
  };

  const canContinueCreneau = !!slot;
  const showStickyCta = etape === "creneau" || etape === "confirmation";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress pills — Ivory Silence */}
      <div className="flex items-center gap-1.5 mb-10 flex-wrap justify-center muse-fade-in" aria-label="Progression réservation">
        {etapesActives.map((e, i) => {
          const done = idx > i;
          const active = idx === i;
          const upcoming = idx < i;
          return (
            <div key={e} className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center justify-center rounded-full text-[11px] tracking-wide px-3 py-1.5 border transition-smooth"
                style={{
                  background: active ? "var(--color-charcoal)" : done ? "var(--color-charcoal)" : "var(--color-card)",
                  color: active || done ? "var(--color-card)" : "var(--color-muted)",
                  borderColor: active || done ? "var(--color-charcoal)" : "var(--color-border)",
                  opacity: upcoming ? 0.85 : 1,
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none"
                  style={{
                    background: active || done ? "rgba(255,255,255,0.18)" : "var(--color-ivory-alt)",
                    color: active || done ? "white" : "var(--color-muted)",
                  }}
                >
                  {done ? "✓" : i + 1}
                </span>
                {labels[e]}
              </span>
              {i < etapesActives.length - 1 && (
                <span
                  className="h-px w-4 hidden sm:block"
                  style={{ background: done ? "var(--color-charcoal)" : "var(--color-border)" }}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border bg-white px-4 py-3 text-sm" style={{ borderColor: "#fecaca", background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* === CATÉGORIE === */}
      {etape === "categorie" && (
        <div className="muse-fade-in">
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            Étape 1 · Service
          </p>
          <h2 className="text-[28px] font-light tracking-tight leading-none mb-2" style={{ color: "var(--color-charcoal)" }}>
            Quel type de soin ?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
            Choisissez une catégorie pour commencer.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {principales.map((cat) => {
              const nb = getAllPrestationsPrincipale(cat.id).length;
              if (nb === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => choisirCategoriePrincipale(cat)}
                  className="text-left rounded-2xl border bg-white p-5 transition-smooth hover:shadow-sm text-left group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <p className="text-[16px] font-medium capitalize leading-tight mb-1.5" style={{ color: "var(--color-charcoal)" }}>
                    {cat.nom}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {nb} soin{nb > 1 ? "s" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === SOUS-CATÉGORIE === */}
      {etape === "sous-categorie" && categoriePrincipale && (
        <div className="muse-fade-in">
          <button
            onClick={() => {
              setEtape("categorie");
              setCategoriePrincipale(null);
            }}
            className="text-xs tracking-wide mb-6 inline-flex items-center gap-1 transition-smooth hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            ← Changer de catégorie
          </button>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            {categoriePrincipale.nom}
          </p>
          <h2 className="text-[26px] font-light tracking-tight leading-none mb-2 capitalize">
            {categoriePrincipale.nom} — quelle zone ?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
            Choisissez une sous-catégorie.
          </p>
          <div className="space-y-3">
            {getSousCategories(categoriePrincipale.id).map((sub) => {
              const nb = getPrestationsDansCategorie(sub.id).length;
              if (nb === 0) return null;
              return (
                <button
                  key={sub.id}
                  onClick={() => choisirSousCategorie(sub)}
                  className="w-full text-left rounded-2xl border bg-white p-5 flex items-center justify-between transition-smooth hover:shadow-sm"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-[15px] font-medium" style={{ color: "var(--color-charcoal)" }}>
                    {sub.nom}
                  </span>
                  <span
                    className="text-xs rounded-full px-2.5 py-1 border"
                    style={{ color: "var(--color-muted)", borderColor: "var(--color-border)", background: "var(--color-ivory)" }}
                  >
                    {nb} soin{nb > 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === PRESTATION === */}
      {etape === "prestation" && categoriePrincipale && (
        <div className="muse-fade-in">
          <button
            onClick={() => {
              if (getSousCategories(categoriePrincipale.id).length > 0) setEtape("sous-categorie");
              else {
                setEtape("categorie");
                setCategoriePrincipale(null);
              }
            }}
            className="text-xs tracking-wide mb-6 inline-flex items-center gap-1 transition-smooth hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            ← Retour
          </button>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            {categoriePrincipale.nom}
            {sousCategorie ? ` · ${sousCategorie.nom}` : ""}
          </p>
          <h2 className="text-[26px] font-light tracking-tight leading-none mb-8">Quel soin ?</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {(sousCategorie
              ? getPrestationsDansCategorie(sousCategorie.id)
              : getPrestationsDansCategorie(categoriePrincipale.id)
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => choisirPrestation(p)}
                className="text-left rounded-2xl border bg-white p-5 transition-smooth hover:shadow-sm flex flex-col"
                style={{ borderColor: "var(--color-border)" }}
              >
                <h3 className="text-[15px] font-medium leading-snug mb-1" style={{ color: "var(--color-charcoal)" }}>
                  {p.nom}
                </h3>
                {p.description && (
                  <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--color-muted)" }}>
                    {p.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--color-ivory-alt)" }}>
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {p.duree_min} min
                  </span>
                  <span className="text-[15px] font-medium" style={{ color: "var(--color-charcoal)" }}>
                    {p.prix} DA
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === TRAVAILLEUSE === */}
      {etape === "travailleuse" && prestation && (
        <div className="muse-fade-in">
          <button
            onClick={() => setEtape("prestation")}
            className="text-xs tracking-wide mb-6 inline-flex items-center gap-1 transition-smooth hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            ← Changer de soin
          </button>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            Praticienne
          </p>
          <h2 className="text-[26px] font-light tracking-tight leading-none mb-2">Avec qui souhaitez-vous ce soin ?</h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
            {prestation.nom} · {prestation.duree_min} min · {prestation.prix} DA
          </p>

          {loadingTravailleuses ? (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Chargement…
            </p>
          ) : travailleuses.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white p-8 text-center" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm mb-1" style={{ color: "var(--color-charcoal)" }}>
                Aucune praticienne disponible pour ce soin.
              </p>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                Contactez le salon pour plus d&apos;informations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {travailleuses.map((t) => (
                <button
                  key={t.id}
                  onClick={() => choisirTravailleuse(t)}
                  className="w-full text-left rounded-2xl border bg-white p-4 flex items-center gap-4 transition-smooth hover:shadow-sm"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span
                    className="h-11 w-11 rounded-full inline-flex items-center justify-center text-sm font-medium shrink-0"
                    style={{ background: "var(--color-charcoal)", color: "white" }}
                    aria-hidden
                  >
                    {t.prenom[0]?.toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium truncate" style={{ color: "var(--color-charcoal)" }}>
                      {t.prenom} {t.nom ?? ""}
                    </span>
                    <span className="block text-xs" style={{ color: "var(--color-muted)" }}>
                      Disponible sur ce soin
                    </span>
                  </span>
                  <span className="text-xs rounded-full border px-3 py-1.5" style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}>
                    Choisir
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === CRÉNEAU === */}
      {etape === "creneau" && prestation && travailleuse && (
        <div className="muse-fade-in pb-24 md:pb-0">
          <button
            onClick={() => setEtape("travailleuse")}
            className="text-xs tracking-wide mb-6 inline-flex items-center gap-1 transition-smooth hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            ← Changer de praticienne
          </button>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            Créneau
          </p>
          <h2 className="text-[26px] font-light tracking-tight leading-none mb-2">Quand souhaitez-vous venir ?</h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
            {prestation.nom} avec <span style={{ color: "var(--color-charcoal)", fontWeight: 500 }}>{travailleuse.prenom}</span>
          </p>

          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-3" style={{ color: "var(--color-muted)" }}>
            Choisissez un jour
          </p>
          {/* Calendrier 14j scroll snap */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
          >
            {days.map((d) => {
              const isSelected = date && d.toDateString() === date.toDateString();
              const isSunday = d.getDay() === 0;
              const label = formatDateFR(d);
              const dayNum = d.getDate();
              const monthShort = d.toLocaleDateString("fr-FR", { month: "short" });
              const weekdayShort = d.toLocaleDateString("fr-FR", { weekday: "short" });
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => !isSunday && handleSelectDate(d)}
                  disabled={isSunday}
                  className="shrink-0 snap-start rounded-2xl border px-3.5 py-3 text-center min-w-[74px] transition-smooth"
                  style={{
                    borderColor: isSelected ? "var(--color-charcoal)" : "var(--color-border)",
                    background: isSelected ? "var(--color-charcoal)" : "white",
                    color: isSelected ? "white" : "var(--color-charcoal)",
                    opacity: isSunday ? 0.35 : 1,
                  }}
                  title={isSunday ? "Fermé le dimanche" : label}
                >
                  <span className="block text-[11px] tracking-wide uppercase" style={{ opacity: isSelected ? 0.9 : 0.7 }}>
                    {weekdayShort}
                  </span>
                  <span className="block text-lg font-medium leading-none my-1">{dayNum}</span>
                  <span className="block text-[11px] capitalize" style={{ opacity: isSelected ? 0.85 : 0.6 }}>
                    {monthShort}
                  </span>
                </button>
              );
            })}
          </div>

          {date && (
            <>
              <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-3" style={{ color: "var(--color-muted)" }}>
                Créneaux avec {travailleuse.prenom}
              </p>
              {loadingSlots ? (
                <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
                  Chargement…
                </p>
              ) : slots.length === 0 ? (
                <p className="text-sm mb-8 rounded-2xl border bg-white p-4" style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}>
                  Aucun créneau disponible ce jour-là. Essayez une autre date.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
                  {slots.map((s) => {
                    const active = slot === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        className="rounded-full border px-3 py-2.5 text-sm font-medium transition-smooth"
                        style={{
                          borderColor: active ? "var(--color-charcoal)" : "var(--color-border)",
                          background: active ? "var(--color-charcoal)" : "white",
                          color: active ? "white" : "var(--color-charcoal)",
                        }}
                      >
                        {formatTimeFR(s)}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* CTA desktop inline */}
          <button
            disabled={!slot}
            onClick={() => setEtape("confirmation")}
            className="hidden md:block w-full rounded-full py-4 text-sm font-medium tracking-wide transition-smooth disabled:opacity-30"
            style={{ background: "var(--color-charcoal)", color: "white" }}
          >
            Continuer
          </button>

          {/* Sticky CTA mobile */}
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md px-4 pt-3 md:hidden" style={{ borderColor: "var(--color-border)", paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
            <button
              disabled={!slot}
              onClick={() => setEtape("confirmation")}
              className="w-full rounded-full py-4 text-sm font-medium tracking-wide transition-smooth disabled:opacity-30"
              style={{ background: "var(--color-charcoal)", color: "white" }}
            >
              Continuer
            </button>
            {!slot && date && slots.length > 0 && (
              <p className="text-center text-xs mt-2" style={{ color: "var(--color-muted)" }}>
                Sélectionnez un créneau pour continuer
              </p>
            )}
          </div>
        </div>
      )}

      {/* === CONFIRMATION === */}
      {etape === "confirmation" && prestation && travailleuse && date && slot && (
        <div className="muse-fade-in pb-24 md:pb-0">
          <button
            onClick={() => setEtape("creneau")}
            className="text-xs tracking-wide mb-6 inline-flex items-center gap-1 transition-smooth hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            ← Changer de créneau
          </button>
          <p className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
            Récapitulatif
          </p>
          <h2 className="text-[26px] font-light tracking-tight leading-none mb-8">Confirmez votre réservation</h2>

          {/* Récap */}
          <div className="rounded-2xl border bg-white p-5 mb-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex justify-between gap-4 text-sm">
              <span style={{ color: "var(--color-muted)" }}>Prestation</span>
              <span className="font-medium text-right" style={{ color: "var(--color-charcoal)" }}>{prestation.nom}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span style={{ color: "var(--color-muted)" }}>Praticienne</span>
              <span className="font-medium" style={{ color: "var(--color-charcoal)" }}>{travailleuse.prenom} {travailleuse.nom ?? ""}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span style={{ color: "var(--color-muted)" }}>Date</span>
              <span className="font-medium text-right" style={{ color: "var(--color-charcoal)" }}>
                {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span style={{ color: "var(--color-muted)" }}>Heure</span>
              <span className="font-medium" style={{ color: "var(--color-charcoal)" }}>{formatTimeFR(slot)}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm pt-3 border-t" style={{ borderColor: "var(--color-ivory-alt)" }}>
              <span style={{ color: "var(--color-muted)" }}>Total</span>
              <span className="font-medium" style={{ color: "var(--color-charcoal)" }}>{prestation.prix} DA</span>
            </div>
          </div>

          {/* Upload photo */}
          <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-charcoal)" }}>
              Photo du modèle souhaité <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(optionnel)</span>
            </label>
            <p className="text-xs mb-3" style={{ color: "var(--color-muted)" }}>
              Envoyez une photo pour que la praticienne vérifie la faisabilité.
            </p>
            {photoPreview ? (
              <div className="flex items-start gap-4">
                <img src={photoPreview} alt="Aperçu" className="h-28 w-28 rounded-2xl object-cover border" style={{ borderColor: "var(--color-border)" }} />
                <button
                  type="button"
                  onClick={retirerPhoto}
                  className="text-xs rounded-full border px-3 py-1.5 transition-smooth"
                  style={{ borderColor: "#fecaca", background: "#fef2f2", color: "#991b1b" }}
                >
                  Retirer
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-smooth hover:opacity-80" style={{ borderColor: "var(--color-border)", background: "var(--color-ivory)" }}>
                <span className="text-[11px] tracking-wide mb-1" style={{ color: "var(--color-muted)" }}>Ajouter une photo</span>
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>JPG, PNG — max 5 MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-2xl border bg-white p-5 mb-6" style={{ borderColor: "var(--color-border)" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-charcoal)" }}>
              Demande particulière <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(optionnel)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Allergies, préférences…"
              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm resize-none focus:outline-none transition-smooth"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>

          {/* CTA desktop */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="hidden md:block w-full rounded-full py-4 text-sm font-medium tracking-wide transition-smooth disabled:opacity-40"
            style={{ background: "var(--color-charcoal)", color: "white" }}
          >
            {submitting ? "Réservation en cours…" : "Confirmer ma réservation"}
          </button>

          {/* Sticky CTA mobile */}
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md px-4 pt-3 md:hidden" style={{ borderColor: "var(--color-border)", paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full rounded-full py-4 text-sm font-medium tracking-wide transition-smooth disabled:opacity-40"
              style={{ background: "var(--color-charcoal)", color: "white" }}
            >
              {submitting ? "Réservation…" : "Confirmer ma réservation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
