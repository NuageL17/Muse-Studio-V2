"use client";
import { ShieldCheck, Flower2, Award, Sparkles } from "lucide-react";

const points = [
  { icon: ShieldCheck, title: "Produits certifiés", desc: "Formules sélectionnées, sans sulfates ni parabènes, testées dermatologiquement." },
  { icon: Flower2, title: "Ambiance sensorielle", desc: "Chaque soin s'accompagne d'une fragrance maison et d'un rituel de respiration." },
  { icon: Award, title: "Expertise reconnue", desc: "Plus de 15 ans d'expérience dans l'esthétique haut de gamme et la cosmétologie." },
  { icon: Sparkles, title: "Personnalisation totale", desc: "Chaque protocle est adapté à votre peau après diagnostic approfondi." },
];

export default function PourquoiNous() {
  return (
    <section id="pourquoi-nous" className="relative py-28 md:py-36 bg-[#faf7f4] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-baseline gap-5 mb-4">
          <span className="font-inter font-extrabold text-[9rem] md:text-[12rem] leading-none text-charcoal/[0.06] tracking-[-0.1em] select-none">3/ 3</span>
          <h2 className="font-instrument text-4xl md:text-6xl lg:text-7xl tracking-tight text-charcoal leading-[1.1]">Pourquoi <em className="italic text-charcoal/50">nous</em></h2>
        </div>
        <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed mb-16 md:mb-20">Un salon pensé comme un refuge — où chaque détail, du parfum au toucher, sert un seul objectif : vous faire du bien.</p>

        {/* 4-point bento + stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-16">
          {points.map((pt) => (
            <div key={pt.title} className="group relative bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-8 shadow-[0_2px_20px_rgba(34,34,34,0.05)] hover:shadow-[0_12px_40px_rgba(34,34,34,0.08)] transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[#f5f0ec] flex items-center justify-center mb-5 text-charcoal group-hover:scale-110 transition-transform duration-300">
                <pt.icon className="w-5 h-5" />
              </div>
              <h3 className="font-inter font-semibold text-lg tracking-tight text-charcoal mb-2">{pt.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats banner — premium numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 rounded-[2.5rem] overflow-hidden shadow-[0_4px_30px_rgba(34,34,34,0.06)]">
          {[
            { value: "98%", label: "de satisfaction" },
            { value: "500+", label: "clientes fidèles" },
            { value: "15", label: "années d'expertise" },
            { value: "12", label: "soins maison" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#faf7f4] px-6 md:px-8 py-8 md:py-10 text-center md:text-left">
              <div className="font-inter font-extrabold text-3xl md:text-5xl tracking-[-0.04em] text-charcoal mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
