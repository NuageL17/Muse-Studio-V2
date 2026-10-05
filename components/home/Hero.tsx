"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuProfil } from "@/components/layout/MenuProfil";

type Props = { prenom: string | null; pointsFidelite: number; estConnectee: boolean };

const navLinks = [
  { href: "/prestations", label: "Soins" },
  { href: "/reservation", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export function Hero({ prenom, pointsFidelite, estConnectee }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="hero-header">
        <Link href="/" className="hero-logo">Muse.</Link>
        <nav className="hero-nav-desktop">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hero-nav-link">{label}</Link>
          ))}
          {estConnectee ? (
            <MenuProfil prenom={prenom} pointsFidelite={pointsFidelite} />
          ) : (
            <Link href="/connexion" className="hero-nav-link">Connexion</Link>
          )}
        </nav>
        <button
          type="button"
          className={`hero-menu-btn ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hero-menu-line" />
          <span className="hero-menu-line" />
          <span className="hero-menu-line" />
        </button>
      </header>

      <div className={`hero-menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
        <nav className="hero-menu-panel" onClick={(e) => e.stopPropagation()}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hero-menu-item" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {estConnectee ? (
            <div onClick={() => setMenuOpen(false)}>
              <MenuProfil prenom={prenom} pointsFidelite={pointsFidelite} />
            </div>
          ) : (
            <Link href="/connexion" className="hero-menu-item" onClick={() => setMenuOpen(false)}>Connexion</Link>
          )}
        </nav>
      </div>

      <section className="hero-section">
        <h1 className="hero-stagger" style={{ animationDelay: "0ms" }}>Muse.</h1>
        <p className="tagline hero-tagline hero-stagger" style={{ animationDelay: "140ms" }}>
          Des soins du visage et du corps, pensés pour que votre peau garde sa lumière.
        </p>
        <div className="hero-stagger" style={{ animationDelay: "280ms" }}>
          <Link href="/reservation" className="hero-cta">
            <span>Réserver un soin</span>
            <span className="hero-cta-arrow" aria-hidden>
              <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
            </span>
          </Link>
        </div>
      </section>

      <footer className="hero-footer">
        <span>Studio d&apos;esthétique, 2026</span>
        <span className="max-md:hidden">Faites défiler</span>
      </footer>
    </>
  );
}
