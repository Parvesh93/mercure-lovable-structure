import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { COLLECTIONS } from "./collections";
import { MODE_LAYOUT, armillaryGuide, project, ringDelta, wheelPoint, type WheelMode } from "./geometry";
import { WheelGondola } from "./WheelGondola";
import { clamp, lerp, smoothstep } from "../motion";

const N = COLLECTIONS.length;
const STEP = (Math.PI * 2) / N;
const SEGS = 40;
const SIDES = [-1, 1] as const;
const SPOKES = N * 2;

export type WheelDrive = {
  /** rotation target in gondola units (0 = Miraé boarding) */
  target: MutableRefObject<number>;
  /** 0→1 entry choreography (rim draw → spokes → gondolas) */
  entry: MutableRefObject<number>;
  /** current rendered rotation, written back by the stage */
  current: MutableRefObject<number>;
  hover: MutableRefObject<number>;
};

/**
 * Renders the wheel for any WheelMode. Structure (SVG) and gondolas (DOM) are
 * updated imperatively each frame from the drive refs — no React re-render
 * per frame. React state only changes when the active gondola changes.
 */
export function WheelStage({
  mode,
  drive,
  onActive,
  onSelect,
  compact = false,
}: {
  mode: WheelMode;
  drive: WheelDrive;
  onActive: (i: number) => void;
  onSelect: (i: number) => void;
  compact?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, SVGElement>());
  const gondolas = useRef<(HTMLButtonElement | null)[]>([]);
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const activeRef = useRef(-1);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  const reg = (k: string) => (el: SVGElement | null) => {
    if (el) els.current.set(k, el);
    else els.current.delete(k);
  };

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = MODE_LAYOUT[mode];
  const base = Math.min(size.h, size.w * (compact ? 1.25 : 0.85));
  const R = L.r * base * (compact ? 1.05 : 1);
  const D = L.d * base * (compact ? 0.95 : 1);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    if (box.current) io.observe(box.current);

    const cx = L.cx * size.w;
    const cy = L.cy * size.h;
    const scr = (p: { x: number; y: number; z: number }) => {
      const q = project(p, L.persp);
      return { x: cx + q.x * R, y: cy + q.y * R, s: q.s, z: p.z };
    };
    const set = (k: string, attrs: Record<string, string | number>) => {
      const el = els.current.get(k);
      if (!el) return;
      for (const a in attrs) el.setAttribute(a, String(attrs[a]));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;

      const cur = drive.current.current + (drive.target.current - drive.current.current) * (1 - Math.exp(-dt * 6.5));
      drive.current.current = Math.abs(cur - drive.target.current) < 0.0005 ? drive.target.current : cur;
      const rot = drive.current.current;
      const e = drive.entry.current;
      const t = now / 1000;

      // ---- rim (static shape, drawn in from the top) ----
      const rimDraw = smoothstep(0, 0.42, e);
      const start = mode === "ferris" ? Math.PI : mode === "armillary" ? Math.PI : Math.PI;
      for (const side of SIDES) {
        for (let k = 0; k < SEGS; k++) {
          const f = clamp(rimDraw * SEGS - k);
          const key = `rim${side}_${k}`;
          if (f <= 0) {
            set(key, { opacity: 0 });
            continue;
          }
          const a0 = start + (k / SEGS) * Math.PI * 2;
          const a1 = start + ((k + f) / SEGS) * Math.PI * 2;
          const p0 = scr(wheelPoint(mode, a0, side));
          const pm = scr(wheelPoint(mode, (a0 + a1) / 2, side));
          const p1 = scr(wheelPoint(mode, a1, side));
          const depth = (pm.z + 1) / 2;
          const op = lerp(1, 0.22, clamp(depth)) * (side === 1 ? 0.55 : 1);
          set(key, {
            d: `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} Q${(2 * pm.x - (p0.x + p1.x) / 2).toFixed(1)} ${(2 * pm.y - (p0.y + p1.y) / 2).toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`,
            opacity: op.toFixed(3),
          });
        }
      }

      // ---- guides per mode ----
      const guideDraw = smoothstep(0.1, 0.55, e);
      if (mode === "ferris") {
        // outer tick ring
        for (let k = 0; k < 60; k++) {
          const a = (k / 60) * Math.PI * 2;
          const p0 = scr(wheelPoint(mode, a, 0, 1.07));
          const p1 = scr(wheelPoint(mode, a, 0, k % 12 === 0 ? 1.13 : 1.1));
          set(`tick${k}`, { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, opacity: (k / 60 < guideDraw ? 0.5 : 0).toString() });
        }
      } else if (mode === "armillary") {
        (["silhouette", "equator", "meridian"] as const).forEach((g, gi) => {
          let d = "";
          const n = 72;
          const upto = Math.floor(n * guideDraw);
          for (let k = 0; k <= upto; k++) {
            const p = scr(armillaryGuide(g, (k / n) * Math.PI * 2));
            const sc = g === "silhouette" ? 1.12 : 1.06;
            const x = cx + (p.x - cx) * sc;
            const y = cy + (p.y - cy) * sc;
            d += `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          }
          set(`guide${gi}`, { d: d || "M0 0", opacity: gi === 0 ? 0.35 : 0.22 });
        });
        const a = scr({ x: -1.35, y: 0, z: 0 });
        const b = scr({ x: 1.35, y: 0, z: 0 });
        // axle along the (yawed + tilted) X axis
        const ax = scr(wheelPoint(mode, 0, -12, 0));
        const bx = scr(wheelPoint(mode, 0, 12, 0));
        set("axle", { x1: ax.x, y1: ax.y, x2: bx.x, y2: bx.y, opacity: 0.6 * guideDraw });
        void a;
        void b;
      } else {
        const top = scr({ x: 0, y: -1.05, z: 0 });
        const bot = scr({ x: 0, y: 0.45, z: 0 });
        set("axle", { x1: top.x, y1: top.y, x2: bot.x, y2: bot.y, opacity: 0.6 * guideDraw });
        let d = "";
        for (let k = 0; k <= 60; k++) {
          const p = scr(wheelPoint(mode, (k / 60) * Math.PI * 2, -12, 0.42));
          d += `${k ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        }
        set("guide0", { d, opacity: 0.35 * guideDraw });
      }

      // ---- spokes (rotate with wheel) ----
      const sp = smoothstep(0.3, 0.62, e);
      for (let j = 0; j < SPOKES; j++) {
        const th = (j / 2 - rot) * STEP;
        const side = j % 2 ? 1 : -1;
        const h = scr(wheelPoint(mode, th, side, 0.09));
        const r = scr(wheelPoint(mode, th, side, lerp(0.09, 1, sp)));
        const depth = (r.z + 1) / 2;
        set(`spoke${j}`, {
          x1: h.x,
          y1: h.y,
          x2: r.x,
          y2: r.y,
          opacity: (sp > 0 ? lerp(0.7, 0.2, clamp(depth)) * (j % 2 ? 0.6 : 1) : 0).toFixed(3),
        });
        // strut across rim thickness
        const s0 = scr(wheelPoint(mode, th, -1));
        const s1 = scr(wheelPoint(mode, th, 1));
        set(`strut${j}`, { x1: s0.x, y1: s0.y, x2: s1.x, y2: s1.y, opacity: (rimDraw >= 1 ? 0.7 : 0).toString() });
      }

      // ---- hub ----
      const hub = scr(wheelPoint(mode, 0, 0, 0));
      const hubIn = smoothstep(0.25, 0.5, e);
      set("hub0", { cx: hub.x, cy: hub.y, r: R * 0.075 * hubIn });
      set("hub1", { cx: hub.x, cy: hub.y, r: R * 0.03 * hubIn });
      set("hub2", { cx: hub.x, cy: hub.y, r: R * 0.15 * hubIn, opacity: 0.35 });

      // ---- gondolas ----
      let best = 0;
      let bestD = 99;
      for (let i = 0; i < N; i++) {
        const g = gondolas.current[i];
        const d = ringDelta(i, rot, N);
        const ad = Math.abs(d);
        if (ad < bestD) {
          bestD = ad;
          best = i;
        }
        const th = d * STEP;
        const anchor = scr(wheelPoint(mode, th, 0));
        const near = 1 - smoothstep(0, 1, ad);
        const m = 1 - smoothstep(0.06, 0.5, ad);
        const drop = smoothstep(0.48 + i * 0.07, 0.72 + i * 0.07, e);
        const depth = clamp((anchor.z + 1) / 2);
        const sc = anchor.s * lerp(0.54, 1, near) * (0.85 + 0.15 * drop);
        const hang = L.upright ? L.hang * D * sc + D * 0.5 * sc * 0.0 : 0;
        const float = Math.sin(t * ((Math.PI * 2) / 4)) * 6 * m;
        const x = anchor.x;
        const y = anchor.y + (L.upright ? hang + D * 0.5 * sc * 0.55 : 0) + float - (1 - drop) * 70;
        if (g) {
          const hov = drive.hover.current === i ? 1 : 0;
          g.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(sc * (1 + hov * 0.04)).toFixed(4)})`;
          g.style.opacity = (drop * lerp(1, 0.55, mode === "ferris" ? 0 : depth)).toFixed(3);
          g.style.zIndex = String(Math.round(500 - anchor.z * 200 + near * 10));
          g.style.setProperty("--m", m.toFixed(3));
          g.style.setProperty("--hover", String(hov));
          g.style.pointerEvents = drop > 0.6 ? "auto" : "none";
        }
        if (L.upright) {
          const cabinTop = y - D * 0.5 * sc;
          set(`hanger${i}`, {
            x1: anchor.x,
            y1: anchor.y,
            x2: x,
            y2: cabinTop,
            opacity: (drop * 0.85).toFixed(3),
          });
          set(`pivot${i}`, { cx: anchor.x, cy: anchor.y, r: 3.2 * drop, opacity: drop });
        }
      }
      if (best !== activeRef.current) {
        activeRef.current = best;
        onActiveRef.current(best);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [mode, size.w, size.h, R, D, L, drive]);

  return (
    <div ref={box} className="absolute inset-0">
      <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0 overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="wheel-gold" gradientUnits="userSpaceOnUse" x1={size.w * 0.3} y1={0} x2={size.w * 0.7} y2={size.h}>
            <stop offset="0%" style={{ stopColor: "var(--bronze)" }} />
            <stop offset="45%" style={{ stopColor: "var(--ochre)" }} />
            <stop offset="60%" style={{ stopColor: "color-mix(in oklab, var(--ochre) 55%, var(--ivory))" }} />
            <stop offset="100%" style={{ stopColor: "var(--ochre)" }} />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#wheel-gold)" strokeLinecap="round">
          {mode === "ferris" &&
            Array.from({ length: 60 }, (_, k) => <line key={`t${k}`} ref={reg(`tick${k}`)} strokeWidth={0.75} opacity={0} />)}
          {mode === "armillary" && [0, 1, 2].map((g) => <path key={`g${g}`} ref={reg(`guide${g}`)} strokeWidth={0.75} />)}
          {mode === "orbit" && <path ref={reg("guide0")} strokeWidth={0.75} />}
          {mode !== "ferris" && <line ref={reg("axle")} strokeWidth={1.25} />}
          {Array.from({ length: SPOKES }, (_, j) => (
            <line key={`s${j}`} ref={reg(`spoke${j}`)} strokeWidth={0.9} opacity={0} />
          ))}
          {Array.from({ length: SPOKES }, (_, j) => (
            <line key={`st${j}`} ref={reg(`strut${j}`)} strokeWidth={0.9} opacity={0} />
          ))}
          {SIDES.map((side) =>
            Array.from({ length: SEGS }, (_, k) => (
              <path key={`r${side}${k}`} ref={reg(`rim${side}_${k}`)} strokeWidth={side === -1 ? 2 : 1.1} opacity={0} />
            )),
          )}
          {MODE_LAYOUT[mode].upright &&
            COLLECTIONS.map((_, i) => <line key={`h${i}`} ref={reg(`hanger${i}`)} strokeWidth={1.1} opacity={0} />)}
          <circle ref={reg("hub2")} strokeWidth={0.75} r={0} />
          <circle ref={reg("hub0")} strokeWidth={1.5} r={0} />
        </g>
        <g style={{ fill: "var(--ochre)" }}>
          <circle ref={reg("hub1")} r={0} />
          {MODE_LAYOUT[mode].upright && COLLECTIONS.map((_, i) => <circle key={`p${i}`} ref={reg(`pivot${i}`)} r={0} />)}
        </g>
      </svg>

      {COLLECTIONS.map((c, i) => (
        <div
          key={c.id}
          onPointerEnter={() => (drive.hover.current = i)}
          onPointerLeave={() => drive.hover.current === i && (drive.hover.current = -1)}
        >
          <WheelGondola ref={(el) => {
              gondolas.current[i] = el;
            }} c={c} index={i} size={D} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
