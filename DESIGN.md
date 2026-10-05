---
version: alpha
name: "Muse Studio"
description: "Ivory Silence — luxe minimal, blanc pur, épuré. Pour un studio d'esthétique pensé mobile-first."
colors:
  primary: "#222222"
  secondary: "#6b6b6b"
  tertiary: "#222222"
  neutral: "#f5f3ee"
  neutral-alt: "#ebe8e0"
  border: "#e0dcd3"
  card: "#ffffff"
  sable: "#d9c8b8"
  argile: "#c4a094"
  success: "#2e7d32"
  danger: "#b91c1c"
  on-primary: "#ffffff"
  on-tertiary: "#ffffff"
  on-neutral: "#222222"
typography:
  display:
    fontFamily: "Inter Tight"
    fontSize: 2.5rem
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  h1:
    fontFamily: "Inter Tight"
    fontSize: 2rem
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  h2:
    fontFamily: "Inter Tight"
    fontSize: 1.375rem
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  h3:
    fontFamily: "Inter Tight"
    fontSize: 1.05rem
    fontWeight: 500
    lineHeight: 1.3
  body-md:
    fontFamily: "Inter Tight"
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter Tight"
    fontSize: 0.8125rem
    lineHeight: 1.5
  label-caps:
    fontFamily: "Inter Tight"
    fontSize: 0.6875rem
    fontWeight: 600
    letterSpacing: "0.14em"
  tagline:
    fontFamily: "Instrument Serif"
    fontSize: 1.5rem
    fontWeight: 400
    lineHeight: 1.25
rounded:
  sm: 10px
  md: 14px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: 16px
  button-primary-hover:
    backgroundColor: "#000000"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: 16px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: 20px
  card-large:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.2xl}"
    padding: 24px
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 14px
---

## Overview

Muse. Studio — Ivory Silence. Un studio d'esthétique au luxe silencieux : blanc pur, ivoire, très épuré. L'identité est typographique avant tout — le mot **Muse.** en Inter Tight 800, tracking −0.05em, est le logo. Pas d'or saturé, pas de gradient criard. La chaleur vient des matières : ivoire #f5f3ee, sable #d9c8b8 en touches, grain subtil.

## Colors

- **Primary (#222222) :** Encre. Titres, texte, boutons primaires. Seule couleur d'action — on ne la dilue jamais.
- **Secondary (#6b6b6b) :** Gris chaud. Légendes, métadonnées, états inactifs.
- **Neutral (#f5f3ee) :** Ivoire. Fond de page. Respire.
- **Neutral Alt (#ebe8e0) :** Ivoire plus dense. Alternance, hover cards.
- **Border (#e0dcd3) :** Liseré fin. Tous les cadres.
- **Card (#ffffff) :** Blanc pur. Toutes les surfaces en carte.
- **Sable (#d9c8b8) / Argile (#c4a094) :** Accents matières, glow discret, jamais en bouton principal.

## Typography

Inter Tight partout. Instrument Serif uniquement pour les phrases en italique (jamais un mot isolé) — `tagline`. Titres en `fontWeight: 300` léger, tracking resserré. Caps en `label-caps` (0.6875rem, 0.14em, 600).

## Layout

Mobile-first (375–767px) est la référence. Grille max `max-w-3xl` (cliente) / `max-w-5xl` (admin). Tab bar fixe en bas sur mobile (≥44px), sidebar sur desktop. Espacements : `md` intra-carte, `lg` entre cartes, `xl` entre sections.

## Elevation & Depth

Pas d'ombres portées lourdes. `card` : bord fin + fond blanc sur ivoire. `card-large` idem avec radius 24px. Le grain SVG (8% opacité) donne la texture.

## Shapes

Rayons généreux : inputs `lg` (16px), cards `xl` (20px), cards larges `2xl` (24px), boutons `full` (pill). Jamais de carré sec.

## Components

- `button-primary` : pill noir, blanc sur noir, seul CTA fort par écran. Hover = noir pur.
- `button-secondary` : pill blanc bord fin, pour actions secondaires.
- `card` / `card-large` : surfaces blanches, bord #e0dcd3.
- `input` : blanc, bord #e0dcd3, radius 16px, 14px padding.

## Do's and Don'ts

- **Do** rester en ivoire/blanc/noir. La couleur vient des photos et du grain, pas de la palette.
- **Do** utiliser des pills (full) pour tous les CTAs et sélections actives.
- **Do** garder les animations sobres : `cubic-bezier(0.22, 1, 0.36, 1)`, 300–500ms, `prefers-reduced-motion` respecté.
- **Don't** introduire de doré/or saturé ou de gradient violet/bleu.
- **Don't** mettre d'emoji en navigation (utiliser des icônes trait fin 1.5px, 24×24).
- **Don't** nester les variantes : `button-primary-hover` est un sibling, pas un child.
