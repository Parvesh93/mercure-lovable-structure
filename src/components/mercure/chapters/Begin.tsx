import { useEffect, useRef } from "react";
import gsap from "gsap";
import closing from "@/assets/project-shriyaamvita.jpg";
import { Logo } from "../Logo";
import { CHAPTERS, CONTACT, PAGES } from "../data";
import { RevealLines } from "../Reveal";
import { registerGsap, useSite } from "../motion";

/** 08 — Begin Your Project + footer. */
export function Begin() {
  const { setEnquiryOpen, scrollTo } = useSite();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-bg]", { scale: 1.25, yPercent: -8 }, { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.8 } });
      gsap.fromTo("[data-mark]", { yPercent: 40 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: "[data-footer]", start: "top bottom", end: "bottom bottom", scrub: 0.8 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="begin" ref={root} data-chapter data-theme="dark" className="relative z-[70] bg-obsidian text-ivory">
      <div className="relative flex min-h-screen items-center overflow-hidden">
        <img data-bg src={closing} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 will-change-transform" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/50 to-obsidian" />
        <div className="relative mx-auto w-full px-6 py-32 text-center md:px-12">
          <p className="type-eyebrow">08 — Begin your project</p>
          <h2 className="mx-auto mt-8 max-w-5xl">
            <RevealLines lines={["Your home,"]} lineClassName="type-display text-ivory" />
            <RevealLines delay={0.1} lines={["composed around you."]} lineClassName="type-accent text-ochre" />
          </h2>
          <p className="type-body mx-auto mt-8 max-w-lg text-ivory/70">
            Visit the 18,000 sq ft Experience Centre in Bengaluru, or tell us about your space. We respond within 24 hours.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setEnquiryOpen(true)}
              data-cursor="Begin"
              className="group inline-flex items-center gap-4 bg-ochre px-9 py-5 type-small uppercase tracking-[0.18em] text-obsidian transition-colors duration-300 hover:bg-ivory"
            >
              Begin your project
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-ivory/30 px-9 py-5 type-small uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:border-ochre hover:text-ochre"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <footer data-footer className="relative overflow-hidden border-t border-ochre/25">
        <div className="mx-auto grid gap-12 px-6 pb-10 pt-20 md:grid-cols-12 md:px-12 lg:px-20">
          <div className="md:col-span-4">
            <Logo className="text-ivory [&_span]:text-ivory" />
            <p className="mt-6 max-w-xs font-accent text-xl italic text-ivory/70">Where craft becomes personal.</p>
          </div>
          <div className="md:col-span-2">
            <p className="type-eyebrow mb-4 text-[0.62rem]">Explore</p>
            <ul className="space-y-2">
              {PAGES.map((p) => (
                <li key={p.label}>
                  <button onClick={() => scrollTo(p.href)} className="link-underline text-sm text-ivory/70 hover:text-ivory">
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="type-eyebrow mb-4 text-[0.62rem]">Experience Centre</p>
            <p className="text-sm leading-relaxed text-ivory/70">{CONTACT.address}</p>
            <p className="mt-3 text-sm text-ivory/50">By appointment · Mon–Sat, 10am–7pm</p>
          </div>
          <div className="md:col-span-3">
            <p className="type-eyebrow mb-4 text-[0.62rem]">Talk to us</p>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><a className="link-underline hover:text-ivory" href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
              <li><a className="link-underline hover:text-ivory" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a className="link-underline hover:text-ivory" href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 pb-8 text-xs text-ivory/40 md:px-12 lg:px-20">
          <p>© {2026} Mercure Homes · An SDP Group company</p>
          <button onClick={() => scrollTo("#top", { duration: 2 })} className="link-underline uppercase tracking-[0.16em] hover:text-ivory">
            Back to {CHAPTERS[0].name} ↑
          </button>
        </div>
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <p data-mark className="text-outline -mb-[3vw] text-center font-display text-[20vw] leading-[0.8] tracking-[-0.02em]">
            MERCURE
          </p>
        </div>
      </footer>
    </section>
  );
}
