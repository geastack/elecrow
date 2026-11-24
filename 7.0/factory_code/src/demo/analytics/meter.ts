import { arcPath, lvMap } from "../../lib/geometry";
import { METER_CENTER } from "./sizes";

// An LVGL meter arc as an SVG stroke: `radius` is its outer edge and
// `thickness` how far it reaches inward, from `from` to `to` degrees.
// Callers bind the result straight to a <path d>, so a changing value
// patches the path in place instead of rebuilding the meter.
export function meterArc(radius: number, thickness: number, from: number, to: number): string {
  return arcPath(METER_CENTER, METER_CENTER, radius - thickness / 2, from, to);
}

// The 270-degree Monthly Target scale from the bottom.
export function targetAngle(percent: number): number {
  return lvMap(percent, 0, 100, 90, 360);
}

// The full-circle Sessions scale from the bottom.
export function sessionAngle(percent: number): number {
  return lvMap(percent, 0, 100, 90, 450);
}

// Each device's share of 97%, leaving a one-percent gap between the three
// parts, as the LVGL demo's timer computes them.
export function sessionShare(count: number, desktop: number, tablet: number, mobile: number): number {
  return Math.trunc((count * 97) / (desktop + tablet + mobile));
}
