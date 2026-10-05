"use client";
import { CalendarDays, ArrowRight, Upload, Check } from "lucide-react";
import { useState } from "react";

export default function ReservationPanel() {
  const [step, setStep] = useState(1);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const heures = ["10:00", "11:30", "14:00", "16:30", "18:00"];

  return (
    <section id="reservation" className="relative py-28 md:py-36 bg-[#faf7f4] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-baseline gap-5 mb-4">
          <span className="font-inter font-extrabold text-[9rem] md:text-[12rem] leading-none text-charcoal/[0.06] tracking-[-0.1em] select-none">5</span>
          <h2 className="font-instrument text-4xl md:text-6xl tracking-tight text-charcoal">Réserver un <em className="italic text-charcoal/50">soin</em></h2>
        </div>
        <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed mb-14">Choisissez votre soin, une travailleuse, un créneau — et laissez-nous faire le reste.</p>

        <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_4px_40px_rgba(34,34,34,0.06)] p-6 md:p-10 lg:p-14">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8 md:mb-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${step >= n ? "bg-charcoal" : "bg-transparent"}`} />
              </div>
            ))}
            <span className="ml-3 text-[10px] font-medium uppercase tracking-widest text-muted">Étape {step}/4</span>
          </div>

          {/* Step content */}
          <div className="min-h-[260px] md:min-h-[300px]">
            {step === 1 && (
              <div>
                <h3 className="font-inter font-semibold text-xl md:text-2xl tracking-tight text-charcoal mb-6">Choisissez votre prestation</h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {["Soin Purifiant", "Massage Relaxant", "Manucure Parfaite", "Épilation Cire", "Soin Capillaire"].map((s) => (
                    <button key={s} className="px-4 md:px-6 py-2.5 rounded-full bg-charcoal text-white text-sm font-medium tracking-wide hover:bg-charcoal/85 transition shadow-[0_2px_10px_rgba(34,34,34,0.1)]">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="font-inter font-semibold text-xl md:text-2xl tracking-tight text-charcoal mb-6">Choisissez un jour</h3>
                <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  <div className="flex gap-3 w-max">
                    {jours.map((j) => (
                      <button key={j} className="flex flex-col items-center px-5 py-4 rounded-2xl bg-white border border-border/40 hover:border-charcoal/20 hover:shadow-md transition min-w-[80px]">
                        <span className="text-[10px] uppercase tracking-wider text-muted mb-1">{j}</span>
                        <span className="text-xl font-inter font-bold text-charcoal">6</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {heures.map((h) => (
                    <button key={h} className="px-4 py-2 rounded-full bg-[#faf7f4] text-charcoal text-sm font-medium border border-border/30 hover:border-charcoal hover:bg-white transition">{h}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 className="font-inter font-semibold text-xl md:text-2xl tracking-tight text-charcoal mb-6">Votre photo de référence</h3>
                <label className={`group relative flex flex-col items-center justify-center gap-3 w-full md:w-[360px] h-40 rounded-2xl border-2 border-dashed transition cursor-pointer ${photoUploaded ? "border-charcoal bg-charcoal/5" : "border-border/60 hover:border-charcoal/30 bg-white/40"}`}>
                  <input type="file" className="hidden" onChange={(e) => setPhotoUploaded(!!e.target.files?.length)} />
                  <Upload className="w-6 h-6 text-muted group-hover:text-charcoal transition" />
                  <span className="text-sm text-muted">{photoUploaded ? "Photo ajoutée ✓" : "Glisser ou cliquer pour ajouter une photo"}</span>
                </label>
                <textarea placeholder="Notes spéciales..." className="mt-5 w-full md:w-[360px] p-4 rounded-2xl bg-white/60 border border-border/40 text-sm text-charcoal placeholder:text-muted/60 focus:outline-none focus:border-charcoal/40 transition resize-none h-28" />
              </div>
            )}
            {step === 4 && (
              <div>
                <h3 className="font-inter font-semibold text-xl md:text-2xl tracking-tight text-charcoal mb-4">Confirmation</h3>
                <div className="bg-[#faf7f4] rounded-2xl p-6 md:p-8 space-y-3 text-sm text-charcoal/90">
                  <div className="flex justify-between"><span className="text-muted">Prestation</span> <span className="font-medium">Soin Purifiant</span></div>
                  <div className="flex justify-between"><span className="text-muted">Travailleuse</span> <span className="font-medium">Marie</span></div>
                  <div className="flex justify-between"><span className="text-muted">Date / Heure</span> <span className="font-medium">Lundi 6 / 14:00</span></div>
                  <div className="flex justify-between"><span className="text-muted">Photo</span> <span className="font-medium">Ajoutée</span></div>
                </div>
                <button onClick={() => setStep(1)} className="mt-6 w-full md:w-auto px-8 py-4 rounded-full bg-charcoal text-white text-sm font-medium tracking-wide hover:bg-charcoal/85 transition shadow-[0_4px_15px_rgba(34,34,34,0.15)] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Confirmer le rendez-vous
                </button>
              </div>
            )}
          </div>

          {/* Sticky bottom navigation */}
          <div className="flex items-center justify-between mt-8 md:mt-10 pt-6 border-t border-border/30">
            <span className="text-xs text-muted tracking-wide">Étape {step}/4</span>
            <button
              onClick={() => setStep(Math.min(4, step + 1))}
              className="inline-flex items-center gap-2 bg-charcoal text-white px-6 md:px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-charcoal/85 transition shadow-[0_4px_15px_rgba(34,34,34,0.15)] hover:shadow-[0_8px_25px_rgba(34,34,34,0.2)] active:scale-[0.98]"
            >
              {step < 4 ? "Suivant" : "Terminer"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
