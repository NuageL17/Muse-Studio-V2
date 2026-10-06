"use client";
// lucide-react not installed — using inline SVG icons instead
import Link from "next/link";

export default function Hero({ prenom, pointsFidelite, estConnectee }: { prenom?: string | null; pointsFidelite?: number; estConnectee?: boolean }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden bg-ivory">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-[#f0e6e8]/40 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-[#f2ebe8]/50 blur-[100px]" />
      </div>

      {/* Editorial vertical text */}
      <aside className="absolute top-[20%] right-6 md:right-12 hidden md:block rotate-90 origin-top-right translate-x-full text-[10px] tracking-[0.35em] font-inter uppercase text-muted/60 select-none">
        À Propos
      </aside>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-24 md:pb-32 flex flex-col gap-8 md:gap-10">
        {/* Main hero title — XXL, uppercase, ultra-tight, premium */}
        <h1 className="font-inter font-extrabold tracking-[-0.06em] leading-[0.82] text-[clamp(5rem,18vw,14rem)] text-charcoal uppercase select-none">
          Muse.
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-0">
          {/* Serif subtitle with italic word */}
          <p className="font-instrument italic text-xl md:text-2xl lg:text-3xl text-charcoal/80 max-w-xl leading-relaxed tracking-tight">
            Un salon où <em className="font-instrument not-italic text-charcoal/60">la beauté</em> devient art de vivre.
          </p>

          {/* Pill CTA — premium black + arrow */}
          <Link href="/reservation" className="group inline-flex items-center gap-3 bg-charcoal text-white px-8 py-4 rounded-full text-sm md:text-base font-medium tracking-wide transition-all hover:bg-charcoal/85 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(34,34,34,0.15)] hover:shadow-[0_14px_40px_rgba(34,34,34,0.22)]">
            Réserver un soin <span className="inline-block ml-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
          </Link>
        </div>
      </div>

      {/* Small decorative sticker (max 3 per spec) */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 flex items-center gap-2.5 bg-white/70 backdrop-blur-md border border-white/40 rounded-full px-4 py-2 text-[11px] tracking-wider uppercase text-charcoal/80 shadow-sm">
        <span>✦ Studio 2027</span>
      </div>
    </section>
  );
}
