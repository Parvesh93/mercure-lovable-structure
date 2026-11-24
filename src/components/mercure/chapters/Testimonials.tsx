import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "../data";
import { EASE } from "../motion";
import { cn } from "@/lib/utils";

const DURATION = 7000;

/** 07 — Testimonials. Auto-advancing quote carousel with word-rise and image wipe. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = TESTIMONIALS[i] ?? TESTIMONIALS[0]!;

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setI((x) => (x + 1) % TESTIMONIALS.length), DURATION);
    return () => clearTimeout(id);
  }, [i, paused]);

  const go = (d: number) => setI((x) => (x + d + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section
      id="testimonials"
      data-chapter
      data-theme="light"
      className="marble relative z-[60] bg-alabaster lg:-mt-[100vh] shadow-[0_-40px_80px_-20px_oklch(0.215_0_0/0.35)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid min-h-screen grid-cols-12 items-center gap-x-6 gap-y-12 px-6 py-28 md:px-12 lg:px-20">
        <div className="relative col-span-12 aspect-[4/5] overflow-hidden lg:col-span-4">
          <AnimatePresence initial={false}>
            <motion.img
              key={i}
              src={t.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.15 }}
              animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
              exit={{ opacity: 0.999 }}
              transition={{ duration: 1.1, ease: EASE.atelier }}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ochre/30" />
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <div className="flex items-center justify-between">
            <p className="type-eyebrow">07 — In their words</p>
            <span className="type-small text-obsidian/50">Placeholder quotes</span>
          </div>
          <span className="mt-8 block font-accent text-[7rem] leading-[0.5] text-ochre" aria-hidden>
            “
          </span>
          <div className="relative min-h-[14rem] md:min-h-[12rem]">
            <AnimatePresence mode="wait">
              <motion.blockquote key={i} className="font-accent text-[clamp(1.6rem,2.7vw,2.6rem)] italic leading-[1.25] text-obsidian" exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}>
                {t.quote.split(" ").map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.8, ease: EASE.settle, delay: k * 0.018 }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-ochre/40 pt-6">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <p className="font-display text-lg text-obsidian">{t.name}</p>
                <p className="type-small font-normal text-obsidian/60">{t.project}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, k) => (
                  <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className="relative h-px w-12 overflow-hidden bg-obsidian/15 py-2 bg-clip-content">
                    <span
                      key={`${i}-${paused}`}
                      className={cn("absolute inset-x-0 top-1/2 h-px origin-left bg-ochre", k < i && "scale-x-100", k > i && "scale-x-0")}
                      style={k === i ? { animation: paused ? "none" : `progress-fill ${DURATION}ms linear forwards`, transform: paused ? "scaleX(1)" : undefined } : undefined}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 text-obsidian transition-colors hover:border-ochre hover:bg-ochre">
                  ←
                </button>
                <button onClick={() => go(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center rounded-full border border-obsidian/20 text-obsidian transition-colors hover:border-ochre hover:bg-ochre">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
