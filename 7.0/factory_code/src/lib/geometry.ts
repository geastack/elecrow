// Geometry for the SVG charts and meters. Angles follow LVGL: degrees
// clockwise from three o'clock, which is also SVG's convention.

const DEG = Math.PI / 180;

export type Point = { x: number; y: number };

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function polar(cx: number, cy: number, radius: number, degrees: number): Point {
  return { x: round(cx + Math.cos(degrees * DEG) * radius), y: round(cy + Math.sin(degrees * DEG) * radius) };
}

function fine(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function finePolar(cx: number, cy: number, radius: number, degrees: number): Point {
  return { x: fine(cx + Math.cos(degrees * DEG) * radius), y: fine(cy + Math.sin(degrees * DEG) * radius) };
}

// An SVG arc from `from` to `to` degrees. Empty when it has no length.
export function arcPath(cx: number, cy: number, radius: number, from: number, to: number): string {
  const sweep = to - from;
  if (sweep <= 0.05) return "";
  // A full circle cannot be one arc command: split it in two.
  if (sweep >= 359.9) {
    return `${arcPath(cx, cy, radius, from, from + 180)} ${arcPath(cx, cy, radius, from + 180, from + 359.9)}`;
  }
  // Finely rounded: an arc's centre is solved from its endpoints, and
  // endpoints rounded to 0.1 px move that centre a little with every end
  // angle, so a growing arc would shift all its points instead of only
  // extending. 1e-4 px keeps the centre still to well under the renderer's
  // point tolerance, while the number still formats on the runtime's short
  // decimal path (a full 17-digit double takes the slow general formatter).
  const a = finePolar(cx, cy, radius, from);
  const b = finePolar(cx, cy, radius, to);
  const large = sweep > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`;
}

export function pointList(points: Point[]): string {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(" ");
}

// lv_map(): LVGL's clamped integer interpolation, which places meter arcs
// and needles on whole degrees.
export function lvMap(x: number, minIn: number, maxIn: number, minOut: number, maxOut: number): number {
  if (x <= minIn) return minOut;
  if (x >= maxIn) return maxOut;
  return Math.trunc(((x - minIn) * (maxOut - minOut)) / (maxIn - minIn)) + minOut;
}
