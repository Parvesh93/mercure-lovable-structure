import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { CHAPTERS, CONTACT, PAGES } from "./data";
import { EASE, useSite } from "./motion";
import { cn } from "@/lib/utils";

/** Which chapter sits under a given viewport y — later DOM wins (it overlaps). */
export function chapterAt(y: number) {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
  let hit: HTMLElement | null = null;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) hit = el;
  }
  return hit;
}

export function Header() {
  const { scrollTo, setEnquiryOpen, introDone } = useSite();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 80);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
      const ch = chapterAt(32);
      setDark(ch?.dataset["theme"] === "dark");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenu(false);
    if (href === "#begin") {
      setEnquiryOpen(true);
      return;
    }
    scrollTo(href);
  };

  const overHero = !solid;
  const lightText = menu || dark;
  return (
    <>
      <header
        data-theme={dark ? "dark" : "light"}
        className={cn(
          "fixed inset-x-0 top-0 transition-[transform,background-color,opacity] duration-300 ease-out",
          menu ? "z-[70]" : "z-50",
          hidden && !menu ? "-translate-y-full" : "translate-y-0",
          introDone ? "opacity-100" : "opacity-0",
          !overHero && (dark ? "bg-walnut/90 backdrop-blur-md" : "bg-ivory/92 backdrop-blur-md"),
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between px-6 transition-[height] duration-300 md:px-10",
            overHero ? "h-24" : "h-16",
          )}
        >
          <a href="#top" onClick={(e) => (e.preventDefault(), go("#top"))} className="shrink-0">
            <Logo className={lightText ? "!text-ivory" : "!text-obsidian"} />
          </a>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {PAGES.map((p) => (
              <a
                key={p.label}
                href={p.href}
                onClick={(e) => (e.preventDefault(), go(p.href))}
                className={cn(
                  "link-underline type-small text-[0.78rem] uppercase tracking-[0.14em] transition-colors duration-300",
                  lightText ? "!text-ivory/85 hover:!text-ivory" : "!text-obsidian/80 hover:!text-obsidian",
                )}
              >
                {p.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setEnquiryOpen(true)}
              className={cn(
                "group hidden items-center gap-3 border border-ochre/70 px-5 py-2.5 type-small text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:!bg-ochre hover:!text-obsidian sm:inline-flex",
                lightText ? "!text-ivory" : "!text-obsidian",
              )}
            >
              Begin your project
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px]"
            >
              <span
                className={cn(
                  "h-px w-7 transition-transform duration-500",
                  menu ? "translate-y-[3.5px] rotate-45 bg-ivory" : lightText ? "bg-ivory" : "bg-obsidian",
                )}
              />
              <span
                className={cn(
                  "h-px w-7 transition-transform duration-500",
                  menu ? "-translate-y-[3.5px] -rotate-45 bg-ivory" : lightText ? "bg-ivory" : "bg-obsidian",
                )}
              />
            </button>
          </div>
        </div>
        <div className={cn("hairline-gold transition-opacity duration-300", overHero ? "opacity-0" : "opacity-60")} />
      </header>

      <MenuOverlay open={menu} onGo={go} />
      {!menu && solid && (
        <div className="fixed inset-x-0 bottom-0 z-[49] grid grid-cols-2 gap-px border-t border-ochre/40 bg-ochre/40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_35px_rgba(26,26,26,.12)] md:hidden">
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="bg-ivory px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[.15em] text-obsidian">WhatsApp</a>
          <button type="button" onClick={() => setEnquiryOpen(true)} className="bg-walnut px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[.15em] text-ivory">Book a visit</button>
        </div>
      )}
    </>
  );
}

function MenuOverlay({ open, onGo }: { open: boolean; onGo: (href: string) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-theme="dark"
          className="fixed inset-0 z-[55] overflow-y-auto bg-obsidian text-ivory"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE.atelier }}
          data-lenis-prevent
        >
          <div className="mx-auto grid min-h-full grid-cols-1 gap-10 px-6 pb-12 pt-28 md:px-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="type-eyebrow mb-8">Menu</p>
              <ul className="space-y-1">
                {PAGES.map((p, i) => (
                  <motion.li
                    key={p.label}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.7, ease: EASE.settle }}
                  >
                    <a
                      href={p.href}
                      onMouseEnter={() => setHover(i)}
                      onClick={(e) => (e.preventDefault(), onGo(p.href))}
                      className="group flex items-baseline gap-5 py-1"
                    >
                      <span className="type-eyebrow w-8 text-[0.68rem]">{p.num}</span>
                      <span
                        className={cn(
                          "font-display text-[2.6rem] leading-[1.05] transition-[color,transform] duration-500 md:text-[3.5rem] xl:text-[4.25rem]",
                          hover === i ? "translate-x-3 text-ivory" : "text-ivory/45",
                        )}
                      >
                        {p.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-14 grid gap-10 sm:grid-cols-2">
                <div>
                  <p className="type-eyebrow mb-4">On this page</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {CHAPTERS.map((c) => (
                      <li key={c.id}>
                        <a
                          href={`#${c.id}`}
                          onClick={(e) => (e.preventDefault(), onGo(`#${c.id}`))}
                          className="link-underline type-small text-ivory/70 hover:text-ivory"
                        >
                          {c.num} {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2 type-small text-ivory/70">
                  <p className="type-eyebrow mb-4">Visit by appointment</p>
                  <a href={CONTACT.phoneHref} className="block hover:text-ivory">{CONTACT.phone}</a>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="block hover:text-ivory">WhatsApp</a>
                  <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="block hover:text-ivory">Instagram</a>
                  <p className="max-w-xs pt-2 font-normal leading-relaxed">{CONTACT.address}</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="sticky top-28 aspect-[4/5] w-full overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={hover}
                    src={PAGES[hover]?.material}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE.settle }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 ring-1 ring-inset ring-ochre/30" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
