import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsap, useSite } from "../motion";

const WORDS: { w: string; accent?: boolean }[] = [
  ..."Every home has a story waiting to be told. At Mercure Homes, we design and".split(" ").map((w) => ({ w })),
  { w: "craft", accent: true },
  ..."the spaces, furniture and details that let yours".split(" ").map((w) => ({ w })),
  { w: "unfold.", accent: true },
];

/** 02 — Brand Statement. Rises over the hero; words light up as you scroll. */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSite();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: "[data-sentence]", start: "top 78%", end: "bottom 45%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        "[data-line]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-line]", start: "top 95%", end: "top 40%", scrub: 0.8 } },
      );
      gsap.fromTo(
        "[data-side]",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "top 10%", scrub: 0.8 } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={root}
      data-chapter
      data-theme="light"
      className="marble relative z-10 -mt-[100vh] bg-ivory shadow-[0_-40px_80px_-20px_oklch(0.215_0_0/0.35)]"
    >
      <div className="mx-auto grid min-h-screen grid-cols-12 gap-x-6 px-6 pb-24 pt-32 md:px-12 lg:px-20">
        <div data-side className="col-span-12 mb-12 flex items-start justify-between lg:col-span-2 lg:mb-0 lg:flex-col">
          <p className="type-eyebrow">02 — Our Philosophy</p>
        </div>
        <div className="col-span-12 lg:col-span-10">
          <p data-sentence className="font-display text-[clamp(2rem,4.3vw,4.4rem)] leading-[1.12] tracking-[-0.01em] text-obsidian">
            {WORDS.map((x, i) => (
              <span key={i}>
                <span data-word className={x.accent ? "font-accent italic text-bronze" : undefined}>
                  {x.w}
                </span>{" "}
              </span>
            ))}
          </p>
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <p data-side className="type-body text-obsidian/70">
              Rooted in the SDP Group's fifty years of manufacturing precision, every piece is shaped in-house — from the first
              sketch to the final, hand-finished detail.
            </p>
            <div data-side className="flex items-end md:justify-end">
              <button onClick={() => scrollTo("#legacy")} className="group inline-flex items-center gap-3 type-small uppercase tracking-[0.16em] text-obsidian">
                <span className="link-underline">Our story</span>
                <span className="text-ochre transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* the gold line that curls into the wheel rim */}
      <div className="px-6 md:px-12 lg:px-20">
        <div data-line className="hairline-gold origin-left" />
      </div>
      <div className="h-[12vh]" />
    </section>
  );
}

