import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PROJECTS, type Project } from "../data";
import { RevealLines } from "../Reveal";
import { registerGsap } from "../motion";
import { cn } from "@/lib/utils";

/** 04 — Featured Projects. Each project pins; image opens from a frame, details drift past. */
export function Projects() {
  return (
    <section id="projects" data-chapter data-theme="dark" className="relative z-30 bg-obsidian text-ivory">
      <div className="hairline-gold opacity-60" />
      <div className="mx-auto flex min-h-[70vh] flex-col justify-end px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <p className="type-eyebrow">04 — Featured Projects</p>
        <h2 className="mt-5 text-ivory">
          <RevealLines lines={["Spaces, composed"]} lineClassName="type-display" />
          <RevealLines delay={0.1} lines={["from first line to final detail."]} lineClassName="type-accent text-ochre" />
        </h2>
      </div>
      {PROJECTS.map((p, i) => (
        <ProjectPanel key={p.slug} p={p} index={i} />
      ))}
    </section>
  );
}

function ProjectPanel({ p, index }: { p: Project; index: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // enter: frame opens to full bleed
      gsap.fromTo(
        "[data-frame]",
        { clipPath: "inset(14% 16% 14% 16%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.8 } },
      );
      gsap.fromTo(
        "[data-img]",
        { scale: 1.3 },
        { scale: 1.06, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.8 } },
      );
      // hold: slow push, copy & material details
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } });
      tl.to("[data-img]", { scale: 1, ease: "none", duration: 1 }, 0)
        .fromTo("[data-shade]", { opacity: 0.2 }, { opacity: 0.75, ease: "none", duration: 0.5 }, 0.15)
        .fromTo("[data-copy]", { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.35 }, 0.05)
        .fromTo("[data-strip]", { xPercent: 35, opacity: 0 }, { xPercent: -20, opacity: 1, ease: "none", duration: 0.85 }, 0.15);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={cn("relative h-[260vh]", index > 0 && "-mt-[100vh]")} style={{ zIndex: index + 1 }}>
      <div className="sticky top-0 h-screen overflow-hidden" data-cursor="View">
        <div data-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <img
            data-img
            src={p.image}
            alt={`${p.name}, ${p.location}`}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div data-shade className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col justify-end px-6 pb-12 md:px-12 lg:px-20">
          <div data-copy className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="type-eyebrow">
                {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")} · {p.location}
              </p>
              <p className="mt-4 font-accent text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-none text-ochre">{p.accent}</p>
              <h3 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.95] tracking-[0.02em] text-ivory">
                {p.caps}
              </h3>
              <p className="mt-3 font-display text-xl tracking-[0.12em] text-ivory/80">{p.name}</p>
            </div>
            <div className="flex flex-col justify-end gap-6 lg:col-span-5 lg:col-start-8">
              <p className="type-body text-ivory/75">{p.copy}</p>
              <div className="flex items-center gap-10 border-t border-ochre/30 pt-5">
                <div>
                  <p className="font-display text-3xl text-ivory">{p.sqft}</p>
                  <p className="type-eyebrow mt-1 text-[0.6rem]">Sq ft</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-ivory">In-house</p>
                  <p className="type-eyebrow mt-1 text-[0.6rem]">Every piece</p>
                </div>
                <span className="ml-auto hidden type-small uppercase tracking-[0.16em] text-ivory/60 sm:block">View project →</span>
              </div>
            </div>
          </div>

          <div data-strip className="mt-10 flex gap-5 will-change-transform">
            {p.details.map((d) => (
              <figure key={d.caption} className="w-[42vw] shrink-0 sm:w-[24vw] lg:w-[15vw]">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={d.src} alt={d.caption} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
                <figcaption className="mt-2 type-small font-normal text-ivory/60">{d.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
