import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import hero from "@/assets/hero-film.jpg";
import { RevealLines } from "../Reveal";
import { EASE, useSite } from "../motion";

/**
 * 01 — The Grand Entrance. Sticky film frame; the Brand Statement rises over
 * it. A gold blueprint layer is revealed around the cursor.
 */
export function Hero() {
  const { introDone, scrollTo, setEnquiryOpen } = useSite();
  const wrap = useRef<HTMLElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const blue = useRef<HTMLDivElement>(null);

  // scroll: film scales 1→1.08, copy drifts at 0.6×, frame darkens as Statement covers it
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / vh));
      if (film.current) film.current.style.transform = `scale(${1 + p * 0.08})`;
      if (copy.current) {
        copy.current.style.transform = `translate3d(0, ${-window.scrollY * 0.6}px, 0)`;
        copy.current.style.opacity = String(1 - p * 1.3);
      }
      if (shade.current) shade.current.style.opacity = String(p * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cursor blueprint mask, trailing
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let tx = window.innerWidth * 0.7,
      ty = window.innerHeight * 0.4,
      x = tx,
      y = ty,
      raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      blue.current?.style.setProperty("--mx", `${x}px`);
      blue.current?.style.setProperty("--my", `${y + window.scrollY * 0}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" ref={wrap} data-chapter data-theme="dark" className="relative h-[200vh] bg-obsidian">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={film} className="absolute inset-0 will-change-transform">
          <img
            src={hero}
            alt="Sunlit Bengaluru living room with marble floor, walnut panelling and a sculptural lounge chair"
            className="absolute inset-0 h-full w-full animate-[slow-pan_28s_ease-in-out_infinite] object-cover"
            width={1920}
            height={1080}
          />
          {/* moving leaf shadow pass */}
          <img
            src={hero}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full animate-[leaf-drift_14s_ease-in-out_infinite] object-cover opacity-25 mix-blend-multiply blur-[6px]"
          />
        </div>
        <div className="absolute inset-0 bg-obsidian/40" />
        <div className="absolute inset-0" style={{ background: "var(--vignette)" }} />
        <div className="grain absolute inset-0 overflow-hidden" />

        {/* gold blueprint, revealed by the cursor */}
        <div
          ref={blue}
          className="pointer-events-none absolute inset-0 text-ochre"
          style={{
            WebkitMaskImage: "radial-gradient(circle 240px at var(--mx, 70%) var(--my, 40%), #000 0%, transparent 100%)",
            maskImage: "radial-gradient(circle 240px at var(--mx, 70%) var(--my, 40%), #000 0%, transparent 100%)",
          }}
          aria-hidden
        >
          <Blueprint />
        </div>

        <div ref={shade} className="pointer-events-none absolute inset-0 bg-obsidian opacity-0" />

        <div ref={copy} className="relative flex h-full flex-col justify-end px-6 pb-[14vh] md:px-12 lg:px-20">
          <motion.p
            className="type-eyebrow mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: introDone ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Mercure Homes · Bengaluru
          </motion.p>
          <h1 className="text-ivory">
            <RevealLines play={introDone} lines={["Considered design."]} lineClassName="type-display" />
            <RevealLines play={introDone} delay={0.12} lines={["Crafted for living."]} lineClassName="type-accent text-ochre" />
          </h1>
          <motion.div
            className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE.settle, delay: 0.6 }}
          >
            <p className="type-body max-w-md text-ivory/80">
              Furniture, lighting and complete interiors — shaped around how you live, and built with the precision of five decades.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("#wheel")}
                className="group inline-flex items-center gap-3 bg-ivory px-7 py-4 type-small uppercase tracking-[0.16em] text-obsidian transition-colors duration-300 hover:bg-ochre"
              >
                Explore collections
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => setEnquiryOpen(true)}
                className="inline-flex items-center gap-3 border border-ivory/40 px-7 py-4 type-small uppercase tracking-[0.16em] text-ivory transition-colors duration-300 hover:border-ochre hover:text-ochre"
              >
                Book a visit
              </button>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => scrollTo("#statement")}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          aria-label="Scroll to begin"
        >
          <span className="type-eyebrow text-[0.58rem] text-ivory/70">Scroll</span>
          <span className="block h-10 w-px animate-[scroll-cue_2.4s_var(--ease-atelier)_infinite] bg-ochre" />
        </motion.button>
      </div>
    </section>
  );
}

/** Line drawings: floor plan, chair elevation, lamp section. */
function Blueprint() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth={1}>
      <g opacity={0.9}>
        {/* grid */}
        {Array.from({ length: 33 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={900} strokeWidth={0.3} opacity={0.35} />
        ))}
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 50} x2={1600} y2={i * 50} strokeWidth={0.3} opacity={0.35} />
        ))}
        {/* floor plan */}
        <g transform="translate(860 90)">
          <rect x={0} y={0} width={560} height={360} strokeWidth={2} />
          <path d="M0 180 H220 V360 M220 180 V0 M360 0 V140 H560 M360 140 V240 H560" strokeWidth={1.4} />
          <path d="M220 250 A70 70 0 0 1 290 320 M360 200 A40 40 0 0 0 400 160" strokeDasharray="4 4" />
          <rect x={30} y={30} width={150} height={90} />
          <circle cx={105} cy={75} r={22} />
          <rect x={400} y={270} width={120} height={60} />
          <path d="M-30 0 H-10 M-30 360 H-10 M-20 0 V360" strokeWidth={0.6} />
          <text x={-60} y={185} fontSize={11} fill="currentColor" stroke="none" transform="rotate(-90 -60 185)" fontFamily="var(--font-display)" letterSpacing="2">
            12 400
          </text>
          <text x={240} y={110} fontSize={11} fill="currentColor" stroke="none" fontFamily="var(--font-display)" letterSpacing="3">
            LIVING
          </text>
          <text x={400} y={70} fontSize={11} fill="currentColor" stroke="none" fontFamily="var(--font-display)" letterSpacing="3">
            COURTYARD
          </text>
        </g>
        {/* chair elevation */}
        <g transform="translate(180 520)" strokeWidth={1.4}>
          <path d="M20 40 C20 10 60 0 110 0 C160 0 200 10 200 40 L210 150 L10 150 Z" />
          <path d="M0 150 H220 V200 H0 Z M30 200 L20 260 M190 200 L200 260" />
          <path d="M-20 270 H240" strokeWidth={0.6} strokeDasharray="6 4" />
          <text x={60} y={300} fontSize={11} fill="currentColor" stroke="none" fontFamily="var(--font-display)" letterSpacing="3">
            SCULPT · ELEV.
          </text>
        </g>
        {/* lamp section */}
        <g transform="translate(560 120)" strokeWidth={1.4}>
          <line x1={80} y1={0} x2={80} y2={140} />
          <path d="M20 200 Q80 120 140 200 Z" />
          <ellipse cx={80} cy={200} rx={60} ry={10} />
          <circle cx={80} cy={185} r={8} strokeDasharray="2 3" />
          <path d="M80 210 L40 330 M80 210 L120 330" strokeWidth={0.6} strokeDasharray="3 5" />
          <text x={30} y={360} fontSize={11} fill="currentColor" stroke="none" fontFamily="var(--font-display)" letterSpacing="3">
            MIRAÉ · SECTION
          </text>
        </g>
        <circle cx={1200} cy={640} r={120} strokeWidth={0.8} />
        <circle cx={1200} cy={640} r={6} />
        <path d="M1080 640 H1320 M1200 520 V760" strokeWidth={0.5} />
      </g>
    </svg>
  );
}
