import { useEffect, useState } from "react";
import { CHAPTERS } from "./data";
import { useSite } from "./motion";
import { chapterAt } from "./Header";
import { cn } from "@/lib/utils";

/** Fixed right-edge rail: 8 gold ticks, active grows with its name, 1 px progress line. */
export function ChapterRail() {
  const { scrollTo } = useSite();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      const ch = chapterAt(mid);
      const idx = CHAPTERS.findIndex((c) => c.id === ch?.id);
      if (idx >= 0) setActive(idx);
      setDark(ch?.dataset["theme"] === "dark");
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = active > 0;
  return (
    <nav
      aria-label="Chapters"
      className={cn(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-700 md:block",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="relative flex flex-col items-end gap-4 py-1 pr-1">
        <span className={cn("absolute right-1 top-0 h-full w-px", dark ? "bg-ivory/15" : "bg-obsidian/10")} />
        <span
          className="absolute right-1 top-0 w-px origin-top bg-ochre transition-[height] duration-200"
          style={{ height: `${progress * 100}%` }}
        />
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => scrollTo(`#${c.id}`)}
            className="group relative flex items-center gap-3"
            aria-current={i === active}
            aria-label={`${c.num} ${c.name}`}
          >
            <span
              className={cn(
                "type-eyebrow whitespace-nowrap text-[0.6rem] transition-all duration-500",
                i === active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70",
              )}
            >
              {c.num} {c.name}
            </span>
            <span
              className={cn(
                "relative z-10 h-px bg-ochre transition-all duration-500",
                i === active ? "w-6" : "w-2.5 opacity-60",
              )}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
