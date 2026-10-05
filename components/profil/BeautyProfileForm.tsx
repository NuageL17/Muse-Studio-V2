"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "gerante" | "travailleuse" | "cliente";

type Profil = {
  id: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  email_contact: string | null;
  date_naissance: string | null;
  comment_connu: string | null;
  type_peau: string | null;
  allergies: string | null;
  preferences: string | null;
  notes_privees: string | null;
  prochain_soin_recommande: string | null;
  date_prochain_soin: string | null;
  info_importante: string | null;
  info_signalee_cliente: string | null;
  vip: boolean | null;
};

type Props = {
  profil: Profil;
  role: Role;
  onSaved?: () => void;
};

const TYPES_PEAU = ["Normale", "Sèche", "Grasse", "Mixte", "Sensible"];

const COMMENT_CONNU_OPTIONS = [
  { value: "", label: "— Non renseigné —" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "bouche_a_oreille", label: "Bouche à oreille" },
  { value: "google", label: "Google" },
  { value: "autre", label: "Autre" },
];

function getChampsModifiables(role: Role): Set<string> {
  switch (role) {
    case "gerante":
      return new Set([
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
      ]);
    case "travailleuse":
      return new Set([
        "type_peau",
        "allergies",
        "preferences",
        "notes_privees",
        "prochain_soin_recommande",
        "date_prochain_soin",
        "info_importante",
      ]);
    case "cliente":
      return new Set([
        "type_peau",
        "allergies",
        "preferences",
        "info_signalee_cliente",
      ]);
  }
}

export function BeautyProfileForm({ profil, role, onSaved }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const champsModifiables = getChampsModifiables(role);
  const peut = (champ: string) => champsModifiables.has(champ);

  const [form, setForm] = useState({
    prenom: profil.prenom ?? "",
    nom: profil.nom ?? "",
    telephone: profil.telephone ?? "",
    email_contact: profil.email_contact ?? "",
    date_naissance: profil.date_naissance ?? "",
    comment_connu: profil.comment_connu ?? "",
    type_peau: profil.type_peau ?? "",
    allergies: profil.allergies ?? "",
    preferences: profil.preferences ?? "",
    notes_privees: profil.notes_privees ?? "",
    prochain_soin_recommande: profil.prochain_soin_recommande ?? "",
    date_prochain_soin: profil.date_prochain_soin ?? "",
    info_importante: profil.info_importante ?? "",
    info_signalee_cliente: profil.info_signalee_cliente ?? "",
    vip: profil.vip ?? false,
  });

  async function sauvegarder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur(null);
    setOk(false);

    const body: Record<string, unknown> = {};
    for (const key of champsModifiables) {
      body[key] = form[key as keyof typeof form];
    }

    let endpoint = "";
    if (role === "gerante") {
      endpoint = `/api/admin/clientes/${profil.id}`;
    } else if (role === "travailleuse") {
      endpoint = `/api/travailleuses/clientes/${profil.id}`;
    } else {
      endpoint = "/api/cliente/profil";
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setOk(true);
      router.refresh();
      if (onSaved) onSaved();
      setTimeout(() => setOk(false), 3000);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  function inputClass(readonly: boolean) {
    return readonly
      ? "w-full px-5 py-3.5 rounded-xl border border-[#e0dcd3] bg-[#f5f3ee] text-sm cursor-not-allowed text-[#222222]"
      : "w-full px-5 py-3.5 rounded-xl bg-[#fdfdfc] border text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all text-sm";
  }

  const afficherCoordonnees = role !== "cliente";

  return (
    <form onSubmit={sauvegarder} className="space-y-4">
      {afficherCoordonnees && (
        <>
          <p
            className="text-xs uppercase tracking-wide pt-2 font-medium"
            style={{ color: "#6b6b6b" }}
          >
            Coordonnées
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">Prénom</label>
              <input
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                readOnly={!peut("prenom")}
                className={inputClass(!peut("prenom"))}
                style={!peut("prenom") ? undefined : { borderColor: "#e0dcd3" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">Nom</label>
              <input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                readOnly={!peut("nom")}
                className={inputClass(!peut("nom"))}
                style={!peut("nom") ? undefined : { borderColor: "#e0dcd3" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">Téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) =>
                  setForm({ ...form, telephone: e.target.value })
                }
                readOnly={!peut("telephone")}
                className={inputClass(!peut("telephone"))}
                style={!peut("telephone") ? undefined : { borderColor: "#e0dcd3" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">
                Email{" "}
                <span style={{ color: "#6b6b6b" }}>(facultatif)</span>
              </label>
              <input
                type="email"
                value={form.email_contact}
                onChange={(e) =>
                  setForm({ ...form, email_contact: e.target.value })
                }
                readOnly={!peut("email_contact")}
                className={inputClass(!peut("email_contact"))}
                style={!peut("email_contact") ? undefined : { borderColor: "#e0dcd3" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">Date de naissance</label>
              <input
                type="date"
                value={form.date_naissance}
                onChange={(e) =>
                  setForm({ ...form, date_naissance: e.target.value })
                }
                readOnly={!peut("date_naissance")}
                className={inputClass(!peut("date_naissance"))}
                style={!peut("date_naissance") ? undefined : { borderColor: "#e0dcd3" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">
                Comment nous a connu
              </label>
              <select
                value={form.comment_connu}
                onChange={(e) =>
                  setForm({ ...form, comment_connu: e.target.value })
                }
                disabled={!peut("comment_connu")}
                className={
                  peut("comment_connu")
                    ? "w-full px-5 py-3.5 rounded-xl border bg-[#fdfdfc] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all text-sm"
                    : "w-full px-5 py-3.5 rounded-xl border border-[#e0dcd3] bg-[#f5f3ee] text-sm cursor-not-allowed text-[#222222]"
                }
                style={peut("comment_connu") ? { borderColor: "#e0dcd3" } : undefined}
              >
                {COMMENT_CONNU_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <p
        className={
          "text-xs uppercase tracking-wide font-medium " +
          (afficherCoordonnees ? "pt-4 border-t border-[#e0dcd3]" : "pt-2")
        }
        style={{ color: "#6b6b6b" }}
      >
        Beauty Profile
      </p>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">Type de peau</label>
        <select
          value={form.type_peau}
          onChange={(e) => setForm({ ...form, type_peau: e.target.value })}
          disabled={!peut("type_peau")}
          className={
            peut("type_peau")
              ? "w-full px-5 py-3.5 rounded-xl border bg-[#fdfdfc] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222]/10 transition-all text-sm"
              : "w-full px-5 py-3.5 rounded-xl border border-[#e0dcd3] bg-[#f5f3ee] text-sm cursor-not-allowed text-[#222222]"
          }
          style={peut("type_peau") ? { borderColor: "#e0dcd3" } : undefined}
        >
          <option value="">— Non défini —</option>
          {TYPES_PEAU.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">
          Allergies / Contre-indications
        </label>
        <textarea
          value={form.allergies}
          onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          readOnly={!peut("allergies")}
          rows={2}
          placeholder="Ex : allergique aux huiles essentielles…"
          className={inputClass(!peut("allergies")) + " resize-none"}
          style={!peut("allergies") ? undefined : { borderColor: "#e0dcd3" }}
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-[#222222]">Préférences</label>
        <textarea
          value={form.preferences}
          onChange={(e) => setForm({ ...form, preferences: e.target.value })}
          readOnly={!peut("preferences")}
          rows={2}
          placeholder="Ex : préfère la cire chaude…"
          className={inputClass(!peut("preferences")) + " resize-none"}
          style={!peut("preferences") ? undefined : { borderColor: "#e0dcd3" }}
        />
      </div>

      {peut("info_importante") && (
        <>
          <p
            className="text-xs uppercase tracking-wide pt-4 border-t border-[#e0dcd3] font-medium"
            style={{ color: "#a07900" }}
          >
            ⚠️ Informations importantes
          </p>
          <textarea
            value={form.info_importante}
            onChange={(e) =>
              setForm({ ...form, info_importante: e.target.value })
            }
            rows={3}
            placeholder="Ex : allergie grave, personne à prévenir…"
            className="w-full px-5 py-3.5 rounded-xl border border-amber-200 bg-amber-50/30 focus:outline-none focus:border-amber-400 text-sm resize-none text-[#222222]"
          />
        </>
      )}

      {peut("info_signalee_cliente") && (
        <>
          <p
            className="text-xs uppercase tracking-wide pt-4 border-t border-[#e0dcd3] font-medium"
            style={{ color: "#1565c0" }}
          >
            💬 Informations que je veux signaler
          </p>
          <textarea
            value={form.info_signalee_cliente}
            onChange={(e) =>
              setForm({ ...form, info_signalee_cliente: e.target.value })
            }
            rows={3}
            placeholder="Ex : je suis enceinte, je préfère le silence…"
            className="w-full px-5 py-3.5 rounded-xl border border-blue-200 bg-blue-50/30 focus:outline-none focus:border-blue-400 text-sm resize-none text-[#222222]"
          />
        </>
      )}

      {peut("notes_privees") && (
        <>
          <p
            className="text-xs uppercase tracking-wide pt-4 border-t border-[#e0dcd3] font-medium"
            style={{ color: "#6b6b6b" }}
          >
            Notes esthéticienne (privé)
          </p>
          <textarea
            value={form.notes_privees}
            onChange={(e) =>
              setForm({ ...form, notes_privees: e.target.value })
            }
            rows={3}
            className={inputClass(false) + " resize-none"}
            style={{ borderColor: "#e0dcd3" }}
          />
        </>
      )}

      {peut("prochain_soin_recommande") && (
        <>
          <p
            className="text-xs uppercase tracking-wide pt-4 border-t border-[#e0dcd3] font-medium"
            style={{ color: "#6b6b6b" }}
          >
            Prochain soin recommandé
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">Soin</label>
              <input
                value={form.prochain_soin_recommande}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prochain_soin_recommande: e.target.value,
                  })
                }
                placeholder="Ex : Rehaussement de cils"
                className={inputClass(false)}
                style={{ borderColor: "#e0dcd3" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-[#222222]">À refaire le</label>
              <input
                type="date"
                value={form.date_prochain_soin}
                onChange={(e) =>
                  setForm({ ...form, date_prochain_soin: e.target.value })
                }
                className={inputClass(false)}
                style={{ borderColor: "#e0dcd3" }}
              />
            </div>
          </div>
        </>
      )}

      {peut("vip") && (
        <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-[#e0dcd3]">
          <input
            type="checkbox"
            checked={form.vip}
            onChange={(e) => setForm({ ...form, vip: e.target.checked })}
            className="w-5 h-5 accent-[#222222]"
          />
          <span className="text-sm text-[#222222]">👑 Cliente VIP</span>
        </label>
      )}

      {erreur && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {erreur}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full text-white text-sm font-medium disabled:opacity-50 shadow-sm transition-all hover:opacity-90"
          style={{ background: "#222222" }}
        >
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
        {ok && (
          <span className="text-sm" style={{ color: "#2e7d32" }}>
            ✅ Enregistré
          </span>
        )}
      </div>
    </form>
  );
}
