import type { PointerEvent } from "react";

/**
 * Publishes the pointer's position over an element as CSS variables: --gx/--gy (percent, for a glow)
 * and --rx/--ry (degrees, for a tilt). The styles that use them live in index.css (.tilt, .spotlight).
 */
export function trackPointer(e: PointerEvent<HTMLElement>, maxTilt = 7) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  el.style.setProperty("--ry", `${((x - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - y) * 2 * maxTilt).toFixed(2)}deg`);
}

export function releasePointer(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}
