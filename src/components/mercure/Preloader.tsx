import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Monogram } from "./Logo";
import { useSite } from "./motion";

/** 00 — Preloader. Gold M draws in, HOMES letter-spaces, panel lifts. ≤1.8 s, first visit only. */
export function Preloader() {
  const { setIntroDone } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const seen = sessionStorage.getItem("mh-intro") === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setGone(true);
          setIntroDone(true);
        },
      });
      return;
    }
    sessionStorage.setItem("mh-intro", "1");
    const strokes = el.querySelectorAll<SVGPathElement>("[data-stroke]");
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
      },
    });
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.12 })
      .fromTo(
        el.querySelector("[data-homes]"),
        { letterSpacing: "0.1em", opacity: 0 },
        { letterSpacing: "0.62em", opacity: 1, duration: 0.6, ease: "power2.out" },
        0.55,
      )
      .to(el.querySelector("[data-inner]"), { y: -40, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.2)
      .add(() => setIntroDone(true), 1.25)
      .to(el, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, 1.25);
    return () => {
      tl.kill();
    };
  }, [setIntroDone]);

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory marble" aria-hidden>
      <div data-inner className="flex flex-col items-center">
        <Monogram className="h-20 w-20 text-ochre" strokeWidth={4} />
        <span data-homes className="mt-5 font-display text-[0.7rem] text-obsidian opacity-0">
          HOMES
        </span>
      </div>
    </div>
  );
}
