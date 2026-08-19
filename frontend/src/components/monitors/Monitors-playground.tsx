"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Globe, Maximize, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui";
import type { Monitor } from "@/types/monitor";
import { cn } from "@/lib/utils";

interface MonitorsPlaygroundProps {
  monitors: Monitor[];
  selectedId: string | null;
  onSelect: (monitor: Monitor) => void;
  /** Called on Escape / clicking empty canvas, to clear the selection. */
  onDeselect?: () => void;
  onCreate?: () => void;
  loading?: boolean;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 2;

/** Human phrasing for the check cadence. */
function cadence(seconds: number) {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.round(seconds / 60);
  return minutes === 1 ? "1 min" : `${minutes} min`;
}

/**
 * Monitors as a constellation.
 *
 * Two presentations from one data set: an orbital canvas on desktop, where
 * there's room for negative space to mean something, and a plain grid below
 * `lg`, where a scatter would just be a list you can't scan. Same cards, same
 * selection, no duplicated state.
 */
export function MonitorsPlayground({
  monitors,
  selectedId,
  onSelect,
  onDeselect,
  onCreate,
  loading = false,
}: MonitorsPlaygroundProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // The live view is kept in a ref and mirrored to state. Gesture maths needs
  // the current value synchronously — reading it from state inside a listener
  // gives you whatever it was when that listener was created.
  const viewRef = useRef({ scale: 1, x: 0, y: 0 });
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });

  const apply = (next: { scale: number; x: number; y: number }) => {
    viewRef.current = next;
    setView(next);
  };

  // Eased transition to a target view. Cancels any glide already running, so
  // hammering the zoom button doesn't queue up a stutter. Skips straight to
  // the target under reduced-motion.
  const glideRaf = useRef<number | null>(null);
  const glide = useCallback((target: { scale: number; x: number; y: number }, ms = 360) => {
    if (glideRaf.current) cancelAnimationFrame(glideRaf.current);
    if (reduce) { apply(target); return; }

    const from = { ...viewRef.current };
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // cubic out

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      const k = ease(t);
      apply({
        scale: from.scale + (target.scale - from.scale) * k,
        x: from.x + (target.x - from.x) * k,
        y: from.y + (target.y - from.y) * k,
      });
      if (t < 1) glideRaf.current = requestAnimationFrame(step);
      else glideRaf.current = null;
    };
    glideRaf.current = requestAnimationFrame(step);
  }, [reduce]);

  useEffect(() => () => { if (glideRaf.current) cancelAnimationFrame(glideRaf.current); }, []);

  const [panning, setPanning] = useState(false);

  // Every active pointer, so one finger pans and two pinch. A Map rather than a
  // count because the gesture needs both positions, not just how many.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; mx: number; my: number } | null>(null);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const moved = useRef(false);

  /** Zoom about a point, keeping whatever sits under it pinned there. */
  const zoomAt = useCallback((nextScale: number, fx: number, fy: number) => {
    const v = viewRef.current;
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    const k = clamped / v.scale;

    apply({ scale: clamped, x: fx - (fx - v.x) * k, y: fy - (fy - v.y) * k });
  }, []);

  // Native and non-passive: React registers wheel handlers passively, and a
  // passive listener can't call preventDefault — so the dashboard would scroll
  // behind the board on every gesture.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = el.getBoundingClientRect();
      const v = viewRef.current;

      // Browsers report a trackpad pinch as a wheel event with ctrlKey set.
      // Everything else — two-finger scroll, mouse wheel, shift+wheel — is a
      // pan. Treating all wheel input as zoom is exactly why two fingers were
      // zooming instead of moving the board.
      if (event.ctrlKey || event.metaKey) {
        zoomAt(
          v.scale * (1 - event.deltaY * 0.01),
          event.clientX - rect.left - rect.width / 2,
          event.clientY - rect.top - rect.height / 2
        );
        return;
      }

      apply({ scale: v.scale, x: v.x - event.deltaX, y: v.y - event.deltaY });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (event: React.PointerEvent) => {
    // Anything interactive opts out of panning. This matters more than it
    // looks: the handler calls setPointerCapture, which redirects the rest of
    // the gesture to the container — so a control that starts a pan never
    // receives its own click. That's why the zoom buttons did nothing.
    if ((event.target as HTMLElement).closest("[data-node], [data-nopan]")) return;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      const v = viewRef.current;
      setPanning(true);
      moved.current = false;
      panStart.current = { x: event.clientX, y: event.clientY, ox: v.x, oy: v.y };
    } else if (pointers.current.size === 2) {
      setPanning(false);
      gesture.current = pinchState();
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    // Two fingers: scale by how far they've spread, and pan by how far their
    // midpoint moved — so a pinch can drag at the same time, which is what
    // makes it feel native instead of stepped.
    if (pointers.current.size === 2 && gesture.current) {
      const el = containerRef.current;
      const next = pinchState();
      if (!el || !next) return;

      const rect = el.getBoundingClientRect();
      const v = viewRef.current;
      const clamped = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, v.scale * (next.dist / gesture.current.dist))
      );
      const k = clamped / v.scale;

      const fx = next.mx - rect.left - rect.width / 2;
      const fy = next.my - rect.top - rect.height / 2;

      apply({
        scale: clamped,
        x: fx - (fx - v.x) * k + (next.mx - gesture.current.mx),
        y: fy - (fy - v.y) * k + (next.my - gesture.current.my),
      });

      gesture.current = next;
      return;
    }

    if (!panning) return;

    if (Math.hypot(event.clientX - panStart.current.x, event.clientY - panStart.current.y) > 4) {
      moved.current = true;
    }

    apply({
      scale: viewRef.current.scale,
      x: panStart.current.ox + (event.clientX - panStart.current.x),
      y: panStart.current.oy + (event.clientY - panStart.current.y),
    });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const wasLonePress = pointers.current.size === 1 && !moved.current;
    pointers.current.delete(event.pointerId);
    gesture.current = null;

    // A press-and-release on bare canvas is a click, and a click on nothing
    // means "deselect" — the same contract as every design tool.
    if (wasLonePress && selectedId !== null) onDeselect?.();

    if (pointers.current.size === 1) {
      // Lifting one finger of a pinch hands control back to panning, re-anchored
      // on the finger still down — otherwise the board jumps.
      const [remaining] = [...pointers.current.values()];
      const v = viewRef.current;
      panStart.current = { x: remaining.x, y: remaining.y, ox: v.x, oy: v.y };
      setPanning(true);
    } else {
      setPanning(false);
    }
  };

  /** Distance and midpoint between the two active pointers. */
  function pinchState() {
    const [a, b] = [...pointers.current.values()];
    if (!a || !b) return null;

    return {
      dist: Math.hypot(b.x - a.x, b.y - a.y),
      mx: (a.x + b.x) / 2,
      my: (a.y + b.y) / 2,
    };
  }

  const reset = () => glide({ scale: 1, x: 0, y: 0 }, 420);

  /** ± one zoom step about the centre. Multiplicative, so each press feels the
   * same size at any zoom level — additive 0.2 is huge at 40% and tiny at 200%. */
  const zoomStep = (dir: 1 | -1) => {
    const v = viewRef.current;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * (dir > 0 ? 1.25 : 0.8)));
    const k = next / v.scale;
    glide({ scale: next, x: v.x * k, y: v.y * k }, 280);
  };

  // Container size, kept current with a ResizeObserver. The minimap draws the
  // viewport rectangle from this, so it must track the inspector opening and
  // closing, not just window resizes.
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Centre the viewport on a world coordinate (minimap click / node jump). */
  const centerOn = (wx: number, wy: number) => {
    const v = viewRef.current;
    glide({ scale: v.scale, x: -wx * v.scale, y: -wy * v.scale });
  };

  /** Bring a node into view — used when a card is selected. Only pans if the
   * node is outside the visible area, so clicking a card that's already on
   * screen doesn't yank the board around under the cursor. */
  const revealNode = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { x, y } = worldPosition(index);
    const v = viewRef.current;
    const sx = x * v.scale + v.x; // node position relative to centre, in px
    const sy = y * v.scale + v.y;
    const halfW = el.clientWidth / 2 - 180;  // margins so a card is fully in
    const halfH = el.clientHeight / 2 - 110;
    if (Math.abs(sx) <= halfW && Math.abs(sy) <= halfH) return;
    glide({ scale: v.scale, x: -x * v.scale, y: -y * v.scale }, 460);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Escape" && selectedId !== null) { onDeselect?.(); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomStep(1); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomStep(-1); }
      else if (e.key === "0") { e.preventDefault(); reset(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const isEmpty = !loading && monitors.length === 0;

  return (
    <div className="relative size-full">
      {/* ---------------- Desktop: orbital canvas ---------------- */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative hidden size-full touch-none select-none overflow-hidden md:block",
          isEmpty ? "cursor-default" : panning ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <CanvasBackdrop scale={view.scale} offset={{ x: view.x, y: view.y }} />

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        >
          <BeaconCore reduce={Boolean(reduce)} />

          {!loading &&
            monitors.map((monitor, index) => {
              const { x, y } = worldPosition(index);

              return (
                <motion.div
                  key={monitor.id}
                  data-node
                  initial={reduce ? false : { opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 26, delay: index * 0.06 }
                  }
                  style={{ position: "absolute", left: x - 144, top: y - 76 }}
                >
                  <MonitorCard
                    monitor={monitor}
                    selected={monitor.id === selectedId}
                    onSelect={() => { onSelect(monitor); revealNode(index); }}
                  />
                </motion.div>
              );
            })}
        </div>

        {loading && (
          <div className="absolute left-1/2 top-1/2">
            {[0, 1, 2].map((i) => {
              const { x, y } = worldPosition(i);
              return (
                <div
                  key={i}
                  aria-hidden
                  style={{ position: "absolute", left: x - 144, top: y - 76 }}
                  className="h-38 w-72 animate-pulse rounded-xl border border-white/8 bg-white/[0.03]"
                />
              );
            })}
          </div>
        )}
        {isEmpty && <EmptyCanvas onCreate={onCreate} reduce={Boolean(reduce)} />}

        {/* Zoom controls — hidden when there's nothing to navigate. */}
        {!isEmpty && !loading && (
          <div
            data-nopan
            className="absolute bottom-4 left-4 flex items-center overflow-hidden rounded-sm border border-white/10 bg-black/80 backdrop-blur-md"
          >
            <ControlButton
              label="Zoom out (−)"
              onClick={() => zoomStep(-1)}
              disabled={view.scale <= MIN_SCALE}
            >
              <Minus className="size-3.5" />
            </ControlButton>

            <button
              type="button"
              onClick={reset}
              title="Reset view (0)"
              className="min-w-14 py-2 font-mono text-[11px] tabular-nums text-white/55 transition-colors hover:text-white"
            >
              {Math.round(view.scale * 100)}%
            </button>

            <ControlButton
              label="Zoom in (+)"
              onClick={() => zoomStep(1)}
              disabled={view.scale >= MAX_SCALE}
            >
              <Plus className="size-3.5" />
            </ControlButton>

            <ControlButton label="Reset view" onClick={reset}>
              <Maximize className="size-3.5" />
            </ControlButton>
          </div>
        )}

        {!isEmpty && !loading && size.w > 0 && (
          <Minimap
            monitors={monitors}
            selectedId={selectedId}
            view={view}
            viewport={size}
            onJump={centerOn}
          />
        )}
      </div>

      {/* ---------------- Tablet & mobile: grid ---------------- */}
      <div className="relative size-full overflow-y-auto md:hidden" data-lenis-prevent>
        <CanvasBackdrop scale={1} offset={{ x: 0, y: 0 }} />

        <div className="relative p-5">
          {loading ? (
            <p className="py-20 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              Loading monitors
            </p>
          ) : isEmpty ? (
            <div className="py-16">
              <EmptyCanvas inline onCreate={onCreate} reduce={Boolean(reduce)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {monitors.map((monitor, index) => (
                <motion.div
                  key={monitor.id}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.05 }}
                >
                  <MonitorCard
                    monitor={monitor}
                    selected={monitor.id === selectedId}
                    onSelect={() => onSelect(monitor)}
                    fluid
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Starfield + radial depth. The dot grid is panned by background-position and
 * sized by scale rather than living inside the transform, so dots stay a
 * constant visual size at any zoom — that's what makes it read as a surface
 * you're moving over rather than an image being resized.
 */
function CanvasBackdrop({
  scale,
  offset,
}: {
  scale: number;
  offset: { x: number; y: number };
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      {/* Photograph under everything, shown as-is. Anchored right so the
         lighthouse stays in frame at any aspect. It's fixed to the viewport,
         not the world layer — a backdrop that panned with the nodes would read
         as the whole scene sliding, not the board moving over it. */}
      <Image
        src="/brand/monitors.png"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover object-right"
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.22) 0.6px, transparent 0.6px), radial-gradient(circle at center, rgba(255,255,255,0.10) 0.5px, transparent 0.5px)",
          backgroundSize: `${96 * scale}px ${96 * scale}px, ${41 * scale}px ${57 * scale}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px, ${offset.x + 19}px ${offset.y + 27}px`,
        }}
      />

    </div>
  );
}

function BeaconCore({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute -left-8 -top-8 grid size-16 place-items-center"
      animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="absolute inset-[-110%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_62%)]" />
      {/* `mix-blend-screen` hides the PNG's black matte on a black canvas but
         shows it as a dark square over a photograph. Screen against a light
         glow behind it, and give the mark a soft halo instead of a plate. */}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.32),transparent_60%)] blur-md" />
      <Image
        src="/brand/beacon-mark.png"
        alt=""
        width={256}
        height={256}
        className="relative size-8 w-auto mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      />
    </motion.div>
  );
}

/** Zero monitors: the canvas stays, the constellation doesn't. */
function EmptyCanvas({
  onCreate,
  reduce,
  inline = false,
}: {
  onCreate?: () => void;
  reduce: boolean;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center px-6 text-center",
        inline ? "" : "absolute inset-0"
      )}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("flex flex-col items-center", inline ? "" : "mt-44")}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Nothing in orbit
        </p>

        <h2 className="mt-3 max-w-sm text-lg font-normal leading-tight tracking-[-0.02em] text-white">
          Point Beacon at a URL{" "}
          <span className="text-white/30">and it appears here.</span>
        </h2>

        {onCreate && (
          <Button variant="white" size="sm" onClick={onCreate} className="mt-7">
            Create monitor
          </Button>
        )}
      </motion.div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-9 place-items-center text-white/45 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}

/**
 * World coordinates in pixels. Six slots per ring, each ring wider and rotated
 * half a slot so nodes never share a spoke — deterministic, so positions are
 * identical on every render.
 */
function worldPosition(index: number) {
  // Slots per ring grow with the ring, so spacing between neighbours stays
  // roughly constant as circumference grows: 6, 10, 14, ...
  let ring = 0;
  let first = 0;
  let per = 6;
  while (index >= first + per) {
    first += per;
    ring += 1;
    per += 4;
  }
  const slot = index - first;

  const radius = 340 + ring * 260;
  // Offset each ring by half a slot so nodes never stack radially, and start
  // at +30° so the tallest overhang lands on the sides, not the top edge.
  const angle =
    (slot / per) * Math.PI * 2 + (ring * Math.PI) / per + Math.PI / 6;

  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

/** Outer radius occupied by `count` nodes — used to size the minimap. */
function orbitExtent(count: number) {
  let ring = 0, first = 0, per = 6;
  while (count > first + per) { first += per; ring += 1; per += 4; }
  return 340 + ring * 260;
}

function MonitorCard({
  monitor,
  selected,
  onSelect,
  fluid = false,
}: {
  monitor: Monitor;
  selected: boolean;
  onSelect: () => void;
  fluid?: boolean;
}) {
  const active = monitor.is_active;
  const { pct, nextIn } = useCheckCycle(monitor.interval, monitor.updated_at, active);

  return (
    <button
      type="button"
      data-node
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative overflow-hidden rounded-lg text-left",
        // Solid surface. One flat fill, one border, one shadow — depth comes from
        // the shadow against the photograph, not from transparency. Opaque also
        // means the card is legible over any part of the image, including the
        // lamp, which glass never quite managed.
        "bg-[#101013] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_30px_-12px_rgba(0,0,0,0.8)]",
        "transition-[transform,border-color,box-shadow] duration-200 ease-out active:scale-[0.99]",
        fluid ? "w-full" : "w-72",
        selected
          ? "border border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_16px_40px_-16px_rgba(0,0,0,0.9)]"
          : "border border-white/[0.09] hover:-translate-y-px hover:border-white/20"
      )}
    >
      {/* Header strip — slightly lighter band, hairline underneath. A real
         card has a header you can point at, not just a first row. */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5">
        <span className="grid size-6 shrink-0 place-items-center rounded-[5px] border border-white/10 bg-[#17171b]">
          <Globe className="size-3 text-white/75" />
        </span>

        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight text-white">
          {monitor.name}
        </p>

        <span className="shrink-0 rounded-[4px] border border-white/12 bg-[#17171b] px-1.5 py-[3px] font-mono text-[9px] font-medium tracking-tight text-white/70">
          {monitor.method}
        </span>

        {/* Status pill: dot + word. Colour never carries the state alone. */}
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-[4px] px-1.5 py-[3px] font-mono text-[9px] font-medium tracking-tight",
            active ? "bg-[#0ca30c]/12 text-[#7bd67b]" : "bg-white/6 text-white/50"
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", active ? "bg-[#0ca30c]" : "bg-white/35")} />
          {active ? "Active" : "Paused"}
        </span>
      </div>

      <div className="px-3.5 pb-3.5 pt-3">
        {/* Two stats, separated by a hairline rather than by whitespace alone —
           it reads as two cells, which is what they are. */}
        <div className="grid grid-cols-2 divide-x divide-white/[0.07]">
          <div className="pr-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">Interval</p>
            <p className="mt-1 text-[19px] font-semibold leading-none tracking-tight text-white">
              {cadence(monitor.interval)}
            </p>
          </div>
          <div className="pl-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">Timeout</p>
            <p className="mt-1 text-[19px] font-semibold leading-none tracking-tight text-white">
              {monitor.timeout}s
            </p>
          </div>
        </div>

        {/* Cycle progress: a plain track and a solid fill. No knob — that read
           as a slider you could drag, and this is a clock. */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between font-mono text-[9px] tracking-tight text-white/40">
            <span>Next check</span>
            {/* Time-derived: server and client compute a different second, so
               React must not try to reconcile the first paint. */}
            <span suppressHydrationWarning className="text-white/70">
              {active ? nextIn : "—"}
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-[2px] bg-white/[0.08]">
            <div
              suppressHydrationWarning
              className={cn("h-full rounded-[2px]", active ? "bg-white/70" : "bg-white/20")}
              style={{ width: `${active ? pct : 0}%` }}
            />
          </div>
        </div>

        {/* Endpoint row: label left, value right, like a settings row. */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-2.5">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
            Endpoint
          </span>
          <span className="min-w-0 truncate font-mono text-[10px] text-white/75">
            {monitor.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    </button>
  );
}

/**
 * Zoomed-out overview in the corner: every node as a dot, the current viewport
 * as a rectangle. Click anywhere to jump there.
 *
 * World coordinates are mapped into the map with one uniform scale chosen so
 * the outermost ring fits, so the map's geometry always matches the board's.
 * `data-nopan` keeps a click here from starting a drag on the board beneath.
 */
function Minimap({
  monitors,
  selectedId,
  view,
  viewport,
  onJump,
}: {
  monitors: Monitor[];
  selectedId: string | null;
  view: { scale: number; x: number; y: number };
  viewport: { w: number; h: number };
  onJump: (wx: number, wy: number) => void;
}) {
  const W = 176;
  const H = 120;

  // World extent to show: the outermost occupied ring plus a card's worth of
  // margin, so nothing sits on the edge of the map.
  const outer = orbitExtent(monitors.length);
  const extent = outer + 200; // half a card of margin past the last ring
  const k = Math.min(W, H) / (extent * 2);

  const toMap = (wx: number, wy: number) => ({
    x: W / 2 + wx * k,
    y: H / 2 + wy * k,
  });

  // Viewport rectangle in world space → map space. Board transform is
  // translate(view.x, view.y) then scale(view.scale) about the container centre,
  // so world (0,0) sits at (view.x, view.y) from centre.
  const vw = viewport.w / view.scale;
  const vh = viewport.h / view.scale;
  const vx = -view.x / view.scale;
  const vy = -view.y / view.scale;
  const tl = toMap(vx - vw / 2, vy - vh / 2);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    onJump((mx - W / 2) / k, (my - H / 2) / k);
  };

  return (
    <div
      data-nopan
      role="img"
      aria-label="Overview map of monitors"
      onClick={handleClick}
      style={{ width: W, height: H }}
      className="absolute bottom-4 right-4 cursor-crosshair overflow-hidden rounded-sm border border-white/12 bg-black/85 backdrop-blur-md"
    >

      {/* Origin */}
      <span
        aria-hidden
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
        style={{ left: W / 2, top: H / 2 }}
      />

      {/* Nodes */}
      {monitors.map((m, i) => {
        const { x, y } = worldPosition(i);
        const pt = toMap(x, y);
        const sel = m.id === selectedId;
        return (
          <span
            key={m.id}
            aria-hidden
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
              sel ? "size-2.5 bg-white ring-2 ring-white/30" : m.is_active ? "size-2 bg-[#0ca30c]" : "size-2 bg-white/35"
            )}
            style={{ left: pt.x, top: pt.y }}
          />
        );
      })}

      {/* Viewport */}
      <span
        aria-hidden
        className="absolute rounded-[2px] border border-white/60 bg-white/6"
        style={{
          left: Math.max(0, tl.x),
          top: Math.max(0, tl.y),
          width: Math.min(W, vw * k),
          height: Math.min(H, vh * k),
        }}
      />
    </div>
  );
}

/**
 * Where we are in the current check cycle, derived from interval + last update.
 * Ticks once a second. It's the one piece of live motion the card has, and it's
 * honest: it says "the next check is due in N seconds", not "the site is up".
 */
function useCheckCycle(intervalSec: number, since: string, active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  const start = new Date(since).getTime();
  const period = Math.max(1, intervalSec) * 1000;
  const elapsed = Number.isFinite(start) ? (now - start) % period : 0;
  const pct = Math.min(100, Math.max(0, (elapsed / period) * 100));
  const remaining = Math.ceil((period - elapsed) / 1000);

  return { pct, nextIn: `${remaining}s` };
}

