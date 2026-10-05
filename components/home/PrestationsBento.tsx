"use client";
import { Clock, Sparkle, Heart } from "lucide-react";

const prestations = [
  { id: "facial-purifiant", title: "Soin Purifiant", tag: "Visage", duration: "60 min", price: "4 800 DA", image: "/prestations/facial.jpg", badge: "Populaire" },
  { id: "massage-relaxant", title: "Massage Relaxant", tag: "Corps", duration: "90 min", price: "7 200 DA", image: "/prestations/massage.jpg", badge: null },
  { id: "manucure-parfaite", title: "Manucure Parfaite", tag: "Mains", duration: "45 min", price: "3 500 DA", image: "/prestations/manucure.jpg", badge: "Nouveau" },
  { id: "epilation-cire", title: "Épilation Cire", tag: "Corps", duration: "30 min", price: "2 900 DA", image: "/prestations/epilation.jpg", badge: null },
  { id: "soin-capillaire", title: "Soin Capillaire", tag: "Cheveux", duration: "75 min", price: "6 000 DA", image: "/prestations/cheveux.jpg", badge: null },
];

export default function PrestationsBento() {
  return (
    <section id="prestations" className="relative py-28 md:py-36 bg-ivory overflow-hidden">
      {/* Section number editorial */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-14 md:mb-20">
        <div className="flex items-baseline gap-5 mb-5">
          <span className="font-inter font-extrabold text-[10rem] md:text-[14rem] leading-none text-charcoal/10 tracking-[-0.1em] select-none">2/ 3</span>
          <h2 className="font-instrument text-3xl md:text-5xl lg:text-6xl tracking-tight text-charcoal leading-[1.15]">
            Nos <em className="italic text-charcoal/60">prestations</em>
          </h2>
        </div>
        <p className="text-muted text-base md:text-lg max-w-lg leading-relaxed">Chaque soin est pensé comme un moment suspendu — entre science, sensorialité et élégance.</p>
      </div>

      {/* Bento grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {prestations.map((p, i) => (
          <a key={p.id} href="#" className={`group relative rounded-[2.5rem] overflow-hidden bg-card border border-border/40 shadow-[0_4px_20px_rgba(34,34,34,0.06)] hover:shadow-[0_14px_50px_rgba(34,34,34,0.12)] transition-all duration-500 hover:-translate-y-1 ${i === 0 ? "md:col-span-2 md:row-span-2 h-[420px] md:h-auto" : "h-[200px] md:h-[200px] md:min-h-[220px]"}`}>
            {/* Scalloped photo border simulation via rounded corners + clip on inner image */}
            <div className="absolute inset-0 z-0">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent z-10" />

            {/* Glass card overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 backdrop-blur-md bg-white/10 border-t border-white/10 rounded-b-[2.5rem]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] uppercase tracking-wider text-white/90 mb-3 border border-white/10">{p.tag}</span>
                  <h3 className="font-inter font-semibold text-xl md:text-2xl text-white tracking-tight leading-tight mb-1">{p.title}</h3>
                  <div className="flex items-center gap-3 text-white/70 text-xs md:text-sm font-medium tracking-wide">
                    <Clock className="w-3.5 h-3.5" /> {p.duration}
                    <span className="w-0.5 h-3 bg-white/20 rounded-full" />
                    <span>{p.price}</span>
                  </div>
                </div>
                {p.badge && (
                  <span className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase backdrop-blur-md border border-white/20 ${p.badge === "Populaire" ? "bg-rose-200/20 text-rose-100" : "bg-amber-200/20 text-amber-100"}`}>
                    {p.badge === "Populaire" ? <Heart className="w-3 h-3" /> : <Sparkle className="w-3 h-3" />}
                    {p.badge}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
