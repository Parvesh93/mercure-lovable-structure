import { useEffect, useRef, useState } from "react";
import { PROCESS } from "../data";
import { clamp, useMedia } from "../motion";
import { cn } from "@/lib/utils";

/** 06 — Our Process. Pinned horizontal track; a gold line draws through six stages. */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  const desktop = useMedia("(min-width: 1024px)");

  useEffect(() => {
    const onScroll = () => {
      const el = root.current;
      const tr = track.current;
      if (!el || !tr) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const span = r.height - vh * 2;
      const p = clamp(-r.top / Math.max(1, span));
      if (desktop) {
        const max = tr.scrollWidth - window.innerWidth;
        tr.style.transform = `translate3d(${-p * max}px,0,0)`;
        if (line.current) line.current.style.transform = `scaleX(${p})`;
        setLit(Math.min(PROCESS.length - 1, Math.floor(p * PROCESS.length + 0.15)));
      } else {
        tr.style.transform = "";
        const rr = tr.getBoundingClientRect();
        const q = clamp((vh * 0.6 - rr.top) / rr.height);
        if (line.current) line.current.style.transform = `scaleY(${q})`;
        setLit(Math.floor(q * PROCESS.length + 0.1) - 1);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [desktop]);

  return (
    <section
      id="process"
      ref={root}
      data-chapter
      data-theme="dark"
      className={cn("relative z-50 -mt-[100vh] bg-walnut text-ivory shadow-[0_-40px_80px_-20px_oklch(0.215_0_0/0.4)]", desktop && "h-[400vh]")}
    >
      <div className={cn("overflow-hidden", desktop && "sticky top-0 h-screen")}>
        <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />
        <div className="relative px-6 pt-28 md:px-12 lg:px-20">
          <p className="type-eyebrow">06 — Our Process</p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.08] text-ivory">
            Six movements, <span className="font-accent italic text-ochre">one quiet line</span> from your first conversation to the
            day you move in.
          </h2>
        </div>

        <div className={cn("relative", desktop ? "mt-[12vh]" : "mt-14 px-6 pb-24")}>
          <div ref={track} className={cn("relative will-change-transform", desktop ? "flex w-max items-start pl-20 pr-[30vw]" : "flex flex-col gap-12 pl-10")}>
            {/* the connecting line */}
            <div className={cn("pointer-events-none absolute bg-ivory/15", desktop ? "left-20 right-[30vw] top-[9px] h-px" : "bottom-0 left-[9px] top-0 w-px")}>
              <div ref={line} className={cn("absolute inset-0 bg-ochre", desktop ? "origin-left" : "origin-top")} style={{ transform: "scale(0)" }} />
            </div>
            {PROCESS.map((s, i) => (
              <div key={s.name} className={cn("relative", desktop ? "w-[34vw] max-w-[520px] pr-12" : "")}>
                <span
                  className={cn(
                    "absolute block h-[19px] w-[19px] rounded-full border transition-all duration-700",
                    desktop ? "left-0 top-0" : "-left-10 top-1",
                    i <= lit ? "border-ochre bg-ochre shadow-[0_0_24px_var(--ochre)]" : "border-ivory/30 bg-walnut",
                  )}
                />
                <div className={cn("transition-all duration-700", desktop ? "pt-14" : "", i <= lit ? "opacity-100" : "opacity-35")}>
                  <p className="type-eyebrow text-[0.65rem]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-display text-[clamp(2.4rem,4.6vw,4.5rem)] leading-none text-ivory">{s.name}</h3>
                  <p className="mt-4 font-accent text-2xl italic text-ivory/70">{s.line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
