/**
 * Shared scroll velocity (px per frame, signed) written by Lenis and read inside
 * WebGL / animation loops without going through React state.
 */
let velocity = 0;
let stamp = 0;

export function setScrollVelocity(v: number) {
  velocity = v;
  stamp = performance.now();
}

/** Lenis stops emitting once it settles, so a stale reading means "not moving". */
export function getScrollVelocity() {
  return performance.now() - stamp > 120 ? 0 : velocity;
}
