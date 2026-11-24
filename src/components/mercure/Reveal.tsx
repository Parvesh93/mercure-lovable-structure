import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./motion";
import { cn } from "@/lib/utils";

/** Mask slide-up per line — the brand "reveal-text" token. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  play,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** when given, animation is controlled; otherwise plays on view */
  play?: boolean;
}) {
  const controlled = play !== undefined;
  return (
    <span className={cn("block", className)}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName)}
            initial={{ y: "110%" }}
            {...(controlled ? { animate: play ? { y: "0%" } : { y: "110%" } } : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-10% 0px" } })}
            transition={{ duration: 1, ease: EASE.atelier, delay: delay + i * 0.08 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE.settle, delay }}
    >
      {children}
    </motion.div>
  );
}
