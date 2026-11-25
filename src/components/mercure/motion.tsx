import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/** Brand motion tokens (Design Flow §7). */
export const EASE = {
  atelier: [0.65, 0, 0.35, 1] as const,
  settle: [0.22, 1, 0.36, 1] as const,
  gsapAtelier: "power2.inOut",
};

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return reduced;
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setMatch(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [query]);
  return match;
}

type ScrollApi = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, opts?: { duration?: number; immediate?: boolean; offset?: number }) => void;
  ready: boolean;
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  enquiryOpen: boolean;
  setEnquiryOpen: (v: boolean) => void;
  enquirySubject: string;
  setEnquirySubject: (value: string) => void;
};

const ScrollCtx = createContext<ScrollApi | null>(null);

export function useSite() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error("useSite outside SmoothScroll");
  return ctx;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one clock. Anchor jumps run 1.2 s ease-in-out (Design Flow §1).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    history.scrollRestoration = "manual";
    const lenis = new Lenis({
      duration: reduced ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setReady(true);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Stop scroll while preloader / modal are on screen
  useEffect(() => {
    const l = lenisRef.current;
    if (!l) return;
    if (!introDone || enquiryOpen) l.stop();
    else l.start();
  }, [introDone, enquiryOpen, ready]);

  const scrollTo: ScrollApi["scrollTo"] = (target, opts = {}) => {
    // Inner-page destinations are real routes, not CSS selectors.
    if (typeof target === "string" && target.startsWith("/")) {
      const destination = new URL(target, window.location.origin);
      const current = window.location.pathname + window.location.search;
      if (current !== destination.pathname + destination.search) {
        history.pushState(null, "", destination.pathname + destination.search);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }
    if (typeof target === "string" && target.startsWith("#") && window.location.pathname !== "/") {
      history.pushState(null, "", "/" + target);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }
    const l = lenisRef.current;
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!l) {
      if (el instanceof HTMLElement) el.scrollIntoView();
      return;
    }
    l.scrollTo(el ?? (target as number), {
      duration: opts.duration ?? 1.2,
      easing: easeInOut,
      immediate: opts.immediate || reduced,
      offset: opts.offset ?? 0,
      force: true,
    });
    if (typeof target === "string" && target.startsWith("#")) {
      history.replaceState(null, "", target === "#top" ? location.pathname : target);
    }
  };

  return (
    <ScrollCtx.Provider
      value={{ lenis: lenisRef.current, scrollTo, ready, introDone, setIntroDone, enquiryOpen, setEnquiryOpen, enquirySubject, setEnquirySubject }}
    >
      {children}
    </ScrollCtx.Provider>
  );
}

/** Mask slide-up line used by headlines (reveal-text token). */
export function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}
export function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
