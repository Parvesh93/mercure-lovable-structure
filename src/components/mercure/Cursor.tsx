import { useEffect, useRef, useState } from "react";

/** 10 px dot + 36 px gold ring trailing at lerp 0.15. Grows to 80 px with a label over [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement;
      const c = t.closest<HTMLElement>("[data-cursor]");
      setLabel(c?.dataset["cursor"] ?? null);
      setDark(t.closest<HTMLElement>("[data-theme]")?.dataset["theme"] === "dark");
    };
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <div ref={dot} className="absolute left-0 top-0">
        <div
          className={`-ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full transition-[opacity,background-color] duration-300 ${
            dark ? "bg-ivory" : "bg-obsidian"
          } ${label ? "opacity-0" : "opacity-100"}`}
        />
      </div>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className={`flex items-center justify-center rounded-full border border-ochre transition-all duration-500 ease-[var(--ease-settle)] ${
            label ? "-ml-10 -mt-10 h-20 w-20 bg-ochre/15 backdrop-blur-[2px]" : "-ml-[18px] -mt-[18px] h-9 w-9"
          }`}
        >
          <span
            className={`type-eyebrow text-[0.6rem] transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"} ${
              dark ? "text-ivory" : "text-obsidian"
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
