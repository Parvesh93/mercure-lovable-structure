import { useState } from "react";
import { COLLECTIONS } from "./collections";
import { useSite } from "../motion";

export function CollectionsWheel() {
  const [active, setActive] = useState(0);
  const { scrollTo, setEnquiryOpen } = useSite();
  const chosen = COLLECTIONS[active];

  const select = (index: number) => {
    setActive((index + COLLECTIONS.length) % COLLECTIONS.length);
  };

  return (
    <section id="wheel" data-chapter data-theme="light" className="relative z-20 min-h-screen overflow-hidden bg-alabaster text-obsidian">
      <div className="mx-auto max-w-[1700px] px-6 pb-20 pt-28 md:px-12 lg:px-20 lg:pb-28">
        <div className="flex items-center justify-between gap-5">
          <p className="type-eyebrow">03 — Collections</p>
          <span className="type-small text-walnut/55">Objects for living</span>
        </div>
        <div className="mt-7 grid items-start gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div className="relative z-10 pt-6">
            <h2 className="type-display">A world of <span className="font-accent italic text-bronze">possibilities.</span></h2>
            <p className="type-body mt-8 max-w-md text-walnut/70">{chosen.teaser}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => select(active - 1)} aria-label="Previous collection" className="flex h-11 w-11 items-center justify-center rounded-full border border-walnut/25 transition-colors hover:border-ochre">←</button>
              <span className="type-eyebrow min-w-16 text-center">{String(active + 1).padStart(2,"0")} / {String(COLLECTIONS.length).padStart(2,"0")}</span>
              <button type="button" onClick={() => select(active + 1)} aria-label="Next collection" className="flex h-11 w-11 items-center justify-center rounded-full border border-walnut/25 transition-colors hover:border-ochre">→</button>
              <button type="button" onClick={() => setEnquiryOpen(true)} className="type-small ml-2 border-b border-ochre pb-2 uppercase text-walnut">Enquire ↗</button>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-[680px] overflow-hidden rounded-full border border-ochre/30 bg-ivory/70">
              <div className="pointer-events-none absolute inset-[10%] rounded-full border border-ochre/15" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-ochre/10" />
              <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-ochre/10" />
              <img key={chosen.id} src={chosen.object} alt={chosen.name} className="absolute inset-[15%] h-[70%] w-[70%] animate-[collection-enter_900ms_ease-out] object-contain" />
              <span className="type-eyebrow absolute bottom-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap">{chosen.kind}</span>
            </div>
            <div className="mt-7 grid grid-cols-5 gap-2 sm:gap-3" role="tablist" aria-label="Collections">
              {COLLECTIONS.map((c,i)=>(
                <button type="button" role="tab" aria-selected={i===active} key={c.id} onClick={()=>select(i)}
                  className={`group relative overflow-hidden border p-2 text-center transition-colors duration-300 sm:p-3 ${i===active ? "border-ochre bg-ivory" : "border-walnut/15 hover:border-ochre/60"}`}>
                  <img src={c.object} alt="" className="mx-auto h-14 w-full object-contain sm:h-20" loading="lazy" />
                  <span className="mt-2 block truncate text-[9px] tracking-[.08em] sm:text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => scrollTo("#projects")} className="type-small mt-12 border-b border-walnut/30 pb-2 uppercase tracking-[.2em] text-walnut/70 hover:text-obsidian">Discover our projects ↗</button>
      </div>
      <style>{`@keyframes collection-enter { from { opacity:0; transform:scale(.92) rotate(-5deg) } to { opacity:1; transform:scale(1) rotate(0) } }`}</style>
    </section>
  );
}
