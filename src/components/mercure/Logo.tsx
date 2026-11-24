import { cn } from "@/lib/utils";

/** Full logo: MERCURE over a gold-ruled HOMES (Brand Guidelines p.14). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none text-ink", className)} aria-label="Mercure Homes">
      <span className="font-display text-[1.45rem] tracking-[0.02em]" aria-hidden>
        MERCURE
      </span>
      <span className="mt-[3px] flex w-full items-center gap-2" aria-hidden>
        <span className="h-px flex-1 bg-ochre" />
        <span className="font-display text-[0.58rem] tracking-[0.32em]">HOMES</span>
        <span className="h-px flex-1 bg-ochre" />
      </span>
    </span>
  );
}

/** The M monogram as two strokes so it can be drawn in (preloader, curtain). */
export function Monogram({ className, strokeWidth = 5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      <path
        data-stroke
        d="M10 92 L27 10 L50 80"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
      />
      <path
        data-stroke
        d="M50 80 L73 10 L90 92"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
      />
    </svg>
  );
}
