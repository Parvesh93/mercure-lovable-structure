import { useEffect, useRef, useState } from "react";
import { STATS } from "../data";
import { RevealLines } from "../Reveal";
import { clamp, smoothstep } from "../motion";
import { cn } from "@/lib/utils";

/** 05 — The SDP Group Legacy. Pinned: each scroll beat counts a figure up and swaps its image. */
export function Legacy() {
  const root = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);
  const counts = useRef<(HTMLSpanElement | null)[]>([]);
  const imgs = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = root.current;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const span = r.height - vh * 2; // pinned travel minus the overlap
      const p = clamp(-r.top / Math.max(1, span));
      const f = p * STATS.length;
      setBeat(Math.min(STATS.length - 1, Math.floor(f)));
      STATS.forEach((s, i) => {
        const local = smoothstep(i, i + 0.7, f);
        const n = Math.round(s.value * local);
        const c = counts.current[i];
        if (c) c.textContent = n.toLocaleString("en-IN");
        const im = imgs.current[i];
        if (im) {
          const vis = i === 0 ? 1 : smoothstep(i - 0.15, i + 0.2, f);
          im.style.clipPath = `inset(${(1 - vis) * 100}% 0 0 0)`;
          im.firstElementChild && ((im.firstElementChild as HTMLElement).style.transform = `scale(${1.15 - 0.15 * smoothstep(i - 0.2, i + 1, f)})`);
        }
      });
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="legacy" ref={root} data-chapter data-theme="light" className="relative z-40 -mt-[100vh] h-[460vh] bg-ivory shadow-[0_-40px_80px_-20px_oklch(0.215_0_0/0.35)]">
      <div className="marble sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto grid h-full grid-cols-12 gap-6 px-6 pb-10 pt-28 md:px-12 lg:px-20">
          <div className="col-span-12 flex flex-col lg:col-span-6">
            <p className="type-eyebrow">05 — The SDP Group Legacy</p>
            <h2 className="mt-5 text-obsidian">
              <RevealLines lines={["Fifty years of precision,"]} lineClassName="type-h2" />
              <RevealLines delay={0.1} lines={["now shaping homes."]} lineClassName="type-accent text-bronze" />
            </h2>
            <p className="type-body mt-6 max-w-md text-obsidian/70">
              Mercure Homes is the residential house of the SDP Group — engineers, machine makers and material sourcers since 1974.
              That discipline lives in every joint, every finish, every delivery date.
            </p>

            <ol className="relative mt-auto grid grid-cols-2 gap-x-8 gap-y-6 pl-0 lg:pl-6">
              <span className="absolute left-0 top-0 hidden h-full w-px bg-obsidian/10 lg:block" />
              <div ref={bar} className="absolute left-0 top-0 hidden h-full w-px origin-top bg-ochre lg:block" />
              {STATS.map((s, i) => (
                <li key={s.label} className={cn("transition-opacity duration-700", i <= beat ? "opacity-100" : "opacity-30")}>
                  <p className="font-display text-[clamp(2.4rem,4.4vw,4.25rem)] leading-none text-obsidian">
                    <span ref={(el) => {
                      counts.current[i] = el;
                    }}>0</span>
                    <span className="text-ochre">{s.suffix}</span>
                    {s.unit && <span className="ml-2 text-[0.35em] tracking-[0.1em] text-obsidian/60">{s.unit}</span>}
                  </p>
                  <p className="type-eyebrow mt-2 text-[0.62rem] text-bronze">{s.label}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative col-span-12 hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="absolute inset-0">
              {STATS.map((s, i) => (
                <div
                  key={s.caption}
                  ref={(el) => {
                    imgs.current[i] = el;
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={{ zIndex: i, clipPath: i === 0 ? undefined : "inset(100% 0 0 0)" }}
                >
                  <img src={s.image} alt={s.caption} className="h-full w-full object-cover will-change-transform" loading="lazy" />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-ochre/30" />
              <div className="absolute -bottom-1 left-0 z-10 translate-y-full pt-3 type-small font-normal text-obsidian/60">
                {STATS[beat]?.caption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
