"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const membres = [
  { nom: "Marie Dubois", role: "Directrice & Gérante", photo: "/equipe/marie.jpg" },
  { nom: "Leïla Benali", role: "Esthéticienne Senior", photo: "/equipe/leila.jpg" },
  { nom: "Camille Moreau", role: "Spécialiste Visage", photo: "/equipe/camille.jpg" },
];

export default function EquipeCarrousel() {
  const [i, setI] = useState(0);
  const prev = () => setI((i - 1 + membres.length) % membres.length);
  const next = () => setI((i + 1) % membres.length);

  return (
    <section id="equipe" className="relative py-28 md:py-36 bg-ivory overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-baseline gap-5 mb-14 md:mb-20">
          <span className="font-inter font-extrabold text-[9rem] md:text-[12rem] leading-none text-charcoal/[0.06] tracking-[-0.1em] select-none">4</span>
          <h2 className="font-instrument text-4xl md:text-6xl tracking-tight text-charcoal">Notre <em className="italic text-charcoal/50">équipe</em></h2>
        </div>

        <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border/40 shadow-[0_4px_30px_rgba(34,34,34,0.05)]">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-[420px] md:h-[520px] overflow-hidden">
              <img src={membres[i].photo} alt={membres[i].nom} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs text-white tracking-wide uppercase">
                Membre {i + 1} / 3
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-6 md:gap-8">
              <h3 className="font-inter font-semibold text-3xl md:text-4xl tracking-tight text-charcoal">{membres[i].nom}</h3>
              <p className="font-instrument italic text-xl text-charcoal/50">{membres[i].role}</p>
              <p className="text-muted text-base md:text-lg leading-relaxed">Passionnée par la peau et la beauté naturelle, elle accompagne chaque cliente avec écoute et précision depuis plusieurs années au studio.</p>
              <div className="flex gap-3 mt-2">
                <button onClick={prev} aria-label="Précédent" className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-charcoal/80 transition shadow-[0_4px_15px_rgba(34,34,34,0.15)]"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={next} aria-label="Suivant" className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-charcoal/80 transition shadow-[0_4px_15px_rgba(34,34,34,0.15)]"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
