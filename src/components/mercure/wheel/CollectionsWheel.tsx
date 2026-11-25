import { useCallback, useEffect, useRef, useState } from "react";
import { COLLECTIONS } from "./collections";
import { registerGsap, useSite } from "../motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type WheelMode = "ferris" | "armillary" | "orbit";
const MODES: WheelMode[] = ["ferris", "armillary", "orbit"];
const TOTAL = COLLECTIONS.length;

function wrap(index: number) {
  return (index % TOTAL + TOTAL) % TOTAL;
}

/**
 * The collection experience is intentionally self-contained:
 * the previously imported WheelGondola/geometry files are empty.
 * This version uses the original Lovable collection object + line assets.
 */
export function CollectionsWheel() {
  const { scrollTo } = useSite();
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<WheelMode>("ferris");
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotatingWheelRef = useRef<HTMLDivElement>(null);
  const pinnedTimelineRef = useRef<ScrollTrigger | null>(null);
  const touchStart = useRef<number | null>(null);
  const current = COLLECTIONS[active];

  const select = useCallback((index: number) => {
    const target = wrap(index);
    // On desktop the scroll position owns the selection and rotation.
    const trigger = pinnedTimelineRef.current;
    if (trigger && window.matchMedia("(min-width: 1024px)").matches) {
      const progress = target / (TOTAL - 1);
      scrollTo(trigger.start + (trigger.end - trigger.start) * progress, { duration: 1 });
    } else {
      setActive(target);
    }
  }, [scrollTo]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Pin the full collections section while normal page scrolling turns the wheel.
  // ScrollTrigger supplies the scroll distance and releases the section at the end.
  useEffect(() => {
    const section = sectionRef.current;
    const wheel = rotatingWheelRef.current;
    if (!section || !wheel) return;

    registerGsap();
    const matchMedia = gsap.matchMedia();

    matchMedia.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const animation = gsap.fromTo(
          wheel,
          { rotation: 0 },
          {
            rotation: -(TOTAL - 1) * (360 / TOTAL),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + Math.round(window.innerHeight * (TOTAL - 1) * 0.85),
              scrub: 0.65,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (trigger) => {
                const index = Math.min(TOTAL - 1, Math.round(trigger.progress * (TOTAL - 1)));
                setActive((previous) => previous === index ? previous : index);
              },
            },
          }
        );

        pinnedTimelineRef.current = animation.scrollTrigger ?? null;
      }, section);

      return () => {
        pinnedTimelineRef.current = null;
        context.revert();
      };
    });

    // Reduced-motion users retain click navigation without being pinned.
    return () => {
      pinnedTimelineRef.current = null;
      matchMedia.revert();
    };
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (!stageRef.current || document.activeElement !== stageRef.current) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setActive((i) => wrap(i + 1));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive((i) => wrap(i - 1));
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const rotation = -active * (360 / TOTAL);
  const modeTransform =
    mode === "armillary"
      ? "rotateX(63deg) rotateY(-16deg)"
      : mode === "orbit"
        ? "rotateX(23deg) rotateY(53deg)"
        : "rotateX(0deg) rotateY(0deg)";

  return (
    <section
      id="wheel"
      ref={sectionRef}
      data-chapter
      data-theme="light"
      className="mh-wheel-section relative z-20 isolate min-h-[100svh] overflow-hidden bg-ivory text-obsidian"
      style={{ background: current.theme === "dark" ? "#f0e8dc" : "#fff9f1" }}
    >
      {/* Architectural backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{
        backgroundImage: "repeating-linear-gradient(125deg, transparent 0px, transparent 190px, rgba(133,91,43,.09) 191px, transparent 192px)"
      }} />
      <span aria-hidden="true" className="mh-wheel-ghost pointer-events-none absolute left-1/2 top-[43%] w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[clamp(120px,23vw,410px)] font-light leading-none tracking-[-.085em] text-transparent" style={{ WebkitTextStroke: "1px rgba(70,43,22,.17)" }}>
        {current.word}
      </span>

      <div className="relative mx-auto min-h-[100svh] max-w-[1920px] px-6 pb-12 pt-[105px] md:px-12 lg:px-[3.2vw] lg:pb-9 lg:pt-[105px]">
        {/* Top-left: same copy hierarchy as Lovable reference */}
        <div className="relative z-20 max-w-[430px]">
          <p className="type-eyebrow">03 — The Collections</p>
          <h2 className="mt-4 font-display text-[clamp(31px,3.2vw,50px)] leading-[1.08] tracking-[-.052em]">
            Five collections.<br />
            <em className="font-accent font-normal text-bronze">One philosophy.</em>
          </h2>
        </div>

        {/* Right upper mode controls */}
        <div className="mh-wheel-settings absolute right-6 top-[104px] z-30 text-right md:right-12 lg:right-[7.5vw]">
          <div className="font-display text-[35px] leading-none tracking-[-.05em]">
            {String(active + 1).padStart(2, "0")}
            <span className="ml-3 text-[13px] tracking-normal text-walnut/60">/ 05</span>
          </div>
          <p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-[.19em] text-ochre">Orientation study</p>
          <div className="inline-flex border border-ochre/40 bg-ivory/85 backdrop-blur-sm" role="group" aria-label="Wheel orientation">
            {MODES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                aria-pressed={mode === item}
                className={`px-3 py-2.5 text-[10px] uppercase tracking-[.11em] transition-colors duration-300 sm:px-4 ${mode === item ? "bg-ochre text-obsidian" : "text-walnut/75 hover:bg-ochre/10"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop animated wheel */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-label="Interactive collections wheel. Scroll, click or use arrow keys to change collections."
          className="mh-wheel-stage absolute left-1/2 top-[46%] z-10 hidden h-[min(61vw,660px)] w-[min(61vw,660px)] -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-ochre lg:block"
          style={{ perspective: "1100px" }}
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const diff = touchStart.current - (event.changedTouches[0]?.clientX ?? touchStart.current);
            if (Math.abs(diff) > 40) select(active + (diff > 0 ? 1 : -1));
            touchStart.current = null;
          }}
        >
          <div className="absolute inset-[7%] rounded-full border border-ochre/15" />
          <div className="absolute inset-0 rounded-full border border-ochre/25" />
          <div aria-hidden="true" className="absolute inset-[-2%] rounded-full" style={{
            background: "repeating-conic-gradient(from 0deg, rgba(202,165,68,.52) 0deg .22deg, transparent .22deg 6deg)",
            WebkitMask: "radial-gradient(circle, transparent 69.6%, #000 70%, #000 70.5%, transparent 70.9%)",
            mask: "radial-gradient(circle, transparent 69.6%, #000 70%, #000 70.5%, transparent 70.9%)",
          }} />

          <div
            className="absolute inset-[7%] transition-transform duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ transform: modeTransform, transformStyle: "preserve-3d" }}
          >
            <div
              ref={rotatingWheelRef}
              className="absolute inset-0 will-change-transform"
            >
              <div className="absolute inset-0 rounded-full border-[2px] border-ochre/70" />
              <div className="absolute inset-[3%] rounded-full border border-ochre/25" />
              {COLLECTIONS.map((collection, index) => {
                const theta = (index / TOTAL) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + 49 * Math.cos(theta);
                const y = 50 + 49 * Math.sin(theta);
                return (
                  <div key={collection.id}>
                    <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px origin-left bg-ochre/45" style={{
                      width: "49%",
                      transform: `rotate(${theta * 180 / Math.PI}deg)`
                    }} />
                    <button
                      type="button"
                      aria-label={`Select ${collection.name}`}
                      aria-pressed={active === index}
                      onClick={() => select(index)}
                      className="absolute z-10 flex h-[clamp(50px,8vw,96px)] w-[clamp(50px,8vw,96px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ochre/20 bg-ivory/50 transition-[border-color,background] hover:border-ochre hover:bg-ivory/90"
                      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${-rotation}deg)` }}
                    >
                      <img src={collection.line} alt="" className="h-[80%] w-[80%] object-contain opacity-75" draggable={false} />
                    </button>
                    <span aria-hidden="true" className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ochre" style={{left: `${x}%`,top: `${y}%`}} />
                  </div>
                );
              })}
              <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ochre/60 bg-ivory/90">
                <span className="absolute inset-[9px] rounded-full border border-ochre/25" />
                <span className="absolute inset-[16px] rounded-full bg-ochre" />
              </span>
            </div>
          </div>
        </div>

        {/* Active collection visual: slightly beneath ring, as in reference */}
        <div aria-live="polite" className="mh-wheel-active absolute bottom-[2vh] left-1/2 z-10 hidden h-[clamp(160px,23vh,270px)] w-[clamp(200px,27vw,390px)] -translate-x-1/2 lg:block">
          <div className="pointer-events-none absolute inset-[10%] rounded-full bg-ochre/[.10] blur-3xl" />
          <img key={current.id} src={current.object} alt={current.name} className="mh-wheel-object relative h-full w-full object-contain object-bottom drop-shadow-[0_20px_22px_rgba(70,43,22,.12)]" />
        </div>

        {/* Active details anchored bottom left */}
        <div className="mh-wheel-details relative z-20 mt-[clamp(70px,9vw,130px)] max-w-[430px] lg:absolute lg:bottom-[7.5vh] lg:left-[3.2vw] lg:mt-0">
          <p className="text-[12px] font-semibold uppercase tracking-[.17em] text-ochre">{current.kind}</p>
          <h3 key={current.id} className="mh-wheel-name mt-2 font-display text-[clamp(48px,4.2vw,72px)] leading-none tracking-[-.055em]">
            {current.name}
          </h3>
          <p className="mt-5 max-w-[420px] text-[15px] leading-[1.9] text-obsidian/65">{current.teaser}</p>
          <button type="button" onClick={() => scrollTo("#begin")} className="group mt-5 inline-flex items-center gap-5 text-[12px] font-semibold uppercase tracking-[.17em]">
            Explore {current.name} <span className="text-ochre transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Mobile / tablet: wheel + object in a correctly sized flow layout */}
        <div className="relative z-10 mt-10 lg:hidden">
          <div className="relative mx-auto aspect-square w-full max-w-[490px]" style={{ perspective: "900px" }}>
            <div className="absolute inset-[7%] rounded-full border border-ochre/50" />
            <div className="absolute inset-[13%] rounded-full border border-ochre/20" />
            <div className="absolute inset-[7%] transition-transform duration-700" style={{ transform: modeTransform }}>
              <div className="absolute inset-0 transition-transform duration-700" style={{ transform: `rotate(${rotation}deg)` }}>
                {COLLECTIONS.map((c,i)=>{
                  const th=(i/TOTAL)*Math.PI*2-Math.PI/2;
                  return (
                    <button key={c.id} type="button" onClick={()=>select(i)} aria-label={`Select ${c.name}`}
                      className="absolute z-10 flex h-[15%] w-[15%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ochre/30 bg-ivory"
                      style={{left:`${50+48*Math.cos(th)}%`,top:`${50+48*Math.sin(th)}%`,transform:`translate(-50%,-50%) rotate(${-rotation}deg)`}}>
                      <img src={c.line} alt="" className="h-[80%] w-[80%] object-contain" />
                    </button>
                  );
                })}
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ivory bg-ochre" />
              </div>
            </div>
            <img key={current.id} src={current.object} alt={current.name} className="mh-wheel-object pointer-events-none absolute bottom-[-13%] left-1/2 h-[58%] w-[62%] -translate-x-1/2 object-contain object-bottom" />
          </div>
          <div className="mt-12 flex items-center justify-center gap-6">
            <button onClick={()=>select(active-1)} type="button" aria-label="Previous collection" className="flex h-12 w-12 items-center justify-center rounded-full border border-ochre/60 text-lg">←</button>
            <span className="type-eyebrow">{String(active+1).padStart(2,"0")} / 05</span>
            <button onClick={()=>select(active+1)} type="button" aria-label="Next collection" className="flex h-12 w-12 items-center justify-center rounded-full border border-ochre/60 text-lg">→</button>
          </div>
        </div>

        {/* Collection index on desktop */}
        <nav aria-label="Select a collection" className="absolute bottom-[7.5vh] right-[4.5vw] z-20 hidden w-[175px] space-y-3 lg:block">
          {COLLECTIONS.map((c,index)=>(
            <button key={c.id} type="button" onClick={()=>select(index)}
              aria-current={active===index?"true":undefined}
              className={`flex w-full items-center justify-end gap-3 text-right font-display text-[16px] transition-colors duration-300 ${active===index?"text-obsidian":"text-walnut/35 hover:text-walnut/70"}`}>
              <span className="text-[10px] tracking-[.16em] text-ochre">{String(index+1).padStart(2,"0")}</span>
              <span className="min-w-[80px]">{c.name}</span>
              <span className={`h-px bg-ochre transition-[width] duration-500 ${active===index?"w-10":"w-4"}`} />
            </button>
          ))}
        </nav>
        <p className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[.18em] text-ochre/75 lg:block">
          Scroll to rotate · Five collections
        </p>
      </div>
      {!reducedMotion && <style>{`
        @keyframes mh-wheel-in { from { opacity: 0; transform: translateY(16px) scale(.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .mh-wheel-object { animation: mh-wheel-in .85s cubic-bezier(.22,1,.36,1) both; }
        .mh-wheel-name { animation: mh-wheel-in .55s cubic-bezier(.22,1,.36,1) both; }
      `}</style>}
    </section>
  );
}
