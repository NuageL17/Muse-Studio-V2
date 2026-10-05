"use client";
import { Star } from "lucide-react";
const avis = [
  { nom:"Claire M.", texte:"Un moment suspendu. Le soin purifiant a transformé ma peau en 1 heure.", date:"Mars 2026", note:5 },
  { nom:"Sofia R.", texte:"L'ambiance, le toucher, le parfum... tout est pensé avec goût.", date:"Février 2026", note:5 },
];
export default function AvisClients() {
  return (<section id="avis" className="py-28 md:py-36 bg-ivory"><div className="max-w-5xl mx-auto px-6 md:px-12"><div className="flex items-baseline gap-5 mb-14"><span className="font-inter font-extrabold text-[9rem] md:text-[12rem] leading-none text-charcoal/[0.06] select-none">6</span><h2 className="font-instrument text-4xl md:text-6xl tracking-tight text-charcoal">Ce qu'elles <em className="italic text-charcoal/50">disent</em></h2></div><div className="grid md:grid-cols-2 gap-5">{avis.map(a=>(<blockquote key={a.nom} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-8 shadow-[0_2px_20px_rgba(34,34,34,0.06)]"><div className="flex gap-0.5 mb-4">{[...Array(a.note)].map((_,i)=>(<Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400"/>))}</div><p className="font-instrument italic text-xl md:text-2xl text-charcoal/90 mb-6 leading-relaxed">"{a.texte}"</p><div className="text-xs uppercase tracking-widest text-muted font-medium">{a.nom} — {a.date}</div></blockquote>))}</div></div></section>);
}
