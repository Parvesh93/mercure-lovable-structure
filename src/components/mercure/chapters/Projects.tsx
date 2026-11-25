import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PROJECTS, type Project } from "../data";
import { RevealLines } from "../Reveal";
import { registerGsap } from "../motion";

/**
 * 04 — Featured Projects
 * Desktop: each project image remains sticky while the detail gallery
 * travels across the bottom of the viewport as the page scrolls.
 * Mobile: gallery is swipeable and never blocks the project description.
 */
export function Projects() {
  return (
    <section
      id="projects"
      data-chapter
      data-theme="dark"
      className="relative z-30 bg-obsidian text-ivory"
    >
      <div className="hairline-gold opacity-60" />
      <div className="mx-auto flex min-h-[65vh] flex-col justify-end px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <p className="type-eyebrow">04 — Featured Projects</p>
        <h2 className="mt-5 text-ivory">
          <RevealLines lines={["Spaces, composed"]} lineClassName="type-display" />
          <RevealLines
            delay={0.1}
            lines={["from first line to final detail."]}
            lineClassName="type-accent text-ochre"
          />
        </h2>
      </div>
      {PROJECTS.map((project, index) => (
        <ProjectPanel key={project.slug} p={project} index={index} />
      ))}
    </section>
  );
}

function ProjectPanel({ p, index }: { p: Project; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerGsap();

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const frame = frameRef.current;
      const image = imageRef.current;
      const shade = shadeRef.current;
      const copy = copyRef.current;
      const strip = stripRef.current;
      if (!frame || !image || !shade || !copy || !strip) return;

      const ctx = gsap.context(() => {
        // Reveal the background as the project enters the viewport.
        gsap.fromTo(
          frame,
          { clipPath: "inset(8% 7% 8% 7%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 95%",
              end: "top 10%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(image, { scale: 1.09 }, { scale: 1, duration: 1, ease: "none" }, 0)
          .fromTo(shade, { opacity: 0.72 }, { opacity: 1, duration: 0.35, ease: "none" }, 0)
          .fromTo(copy, { y: 24, opacity: 0.85 }, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0);

        // Animate the gallery through the middle of the sticky chapter,
        // then HOLD the final frame before the following project enters.
        // Ending at "bottom 165%" leaves 65vh of pinned viewing time.
        const rightMargin = () => Math.min(window.innerWidth * 0.08, 125);
        const startX = () => window.innerWidth * 0.7;
        const endX = () =>
          Math.min(0, window.innerWidth - strip.scrollWidth - rightMargin());

        gsap.fromTo(
          strip,
          { x: startX },
          {
            x: endX,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom 165%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          },
        );
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-auto bg-obsidian lg:h-[330vh]"
      style={{ zIndex: index + 1 }}
    >
      <div className="relative min-h-screen overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <div ref={frameRef} className="absolute inset-0 overflow-hidden">
          <img
            ref={imageRef}
            src={p.image}
            alt={`${p.name}, ${p.location}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div
            ref={shadeRef}
            className="absolute inset-0 bg-gradient-to-b from-obsidian/65 via-obsidian/30 to-obsidian/80"
          />
        </div>

        {/* Content is confined to the upper part on desktop, leaving a
            dedicated bottom runway for the horizontal image gallery. */}
        <div className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-28 md:px-12 lg:h-full lg:min-h-0 lg:pb-0 lg:pt-[16vh] lg:px-20">
          <div ref={copyRef} className="grid gap-7 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <p className="type-eyebrow">
                {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")} · {p.location}
              </p>
              <p className="mt-4 font-accent text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-none text-ochre">
                {p.accent}
              </p>
              <h3 className="mt-1 font-display text-[clamp(2.75rem,5.4vw,5.5rem)] uppercase leading-[0.96] tracking-[0.02em] text-ivory">
                {p.caps}
              </h3>
              <p className="mt-3 font-display text-lg tracking-[0.12em] text-ivory/85">{p.name}</p>
              <a href={"/projects/" + p.slug} className="relative z-30 mt-5 inline-flex w-fit items-center gap-3 border-b border-ochre/70 pb-2 text-xs uppercase tracking-[.16em] text-ivory hover:text-ochre">View project <span>↗</span></a>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
              <p className="type-body max-w-[600px] text-ivory/85">{p.copy}</p>
              <div className="flex flex-wrap items-center gap-8 border-t border-ochre/40 pt-5">
                <div>
                  <p className="font-display text-[clamp(1.5rem,2.3vw,2.2rem)] text-ivory">{p.sqft}</p>
                  <p className="type-eyebrow mt-1 text-[0.6rem]">Sq ft</p>
                </div>
                <div>
                  <p className="font-display text-[clamp(1.5rem,2.3vw,2.2rem)] text-ivory">In-house</p>
                  <p className="type-eyebrow mt-1 text-[0.6rem]">Every piece</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: swipeable gallery, always visible and in normal flow. */}
          <div className="relative z-20 mt-10 w-full lg:hidden">
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:px-12">
              {p.details.map((detail) => (
                <figure key={detail.caption} className="w-[72vw] max-w-[340px] shrink-0 snap-center">
                  <div className="aspect-[4/3] overflow-hidden border border-white/15 bg-obsidian/40">
                    <img src={detail.src} alt={detail.caption} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-3 text-xs tracking-[0.04em] text-ivory/80">{detail.caption}</figcaption>
                </figure>
              ))}
            </div>
            <p className="type-eyebrow mt-3 !text-ivory/70">Swipe to explore materials →</p>
          </div>
        </div>

        {/* Desktop gallery: separate image track sliding right-to-left,
            unobstructed by text and clipped to the project viewport. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[5vh] z-20 hidden h-[min(30vh,280px)] overflow-hidden lg:block">
          <div
            ref={stripRef}
            className="flex h-full w-max items-start gap-[clamp(16px,1.8vw,30px)] will-change-transform"
          >
            {p.details.map((detail) => (
              <figure key={detail.caption} className="w-[clamp(275px,26vw,440px)] shrink-0">
                <div className="h-[min(25vh,235px)] overflow-hidden border border-ivory/25 bg-obsidian/30">
                  <img
                    src={detail.src}
                    alt={detail.caption}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs tracking-[0.08em] text-ivory/90">
                  {detail.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
