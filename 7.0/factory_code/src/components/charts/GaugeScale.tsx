import { arcPath, lvMap, polar } from "../../lib/geometry";

// One coloured stretch of a gauge: an arc of `thickness` px on the scale's
// edge, and the ticks whose values fall in it drawn in `tickColor`.
export type ScaleBand = { from: number; to: number; color: string; tickColor: string; thickness: number };

export type ScaleSpec = {
  cx: number;
  cy: number;
  radius: number;
  rotation: number;
  sweep: number;
  min: number;
  max: number;
  ticks: number;
  tickWidth: number;
  tickLength: number;
  majorEvery: number;
  majorWidth: number;
  majorLength: number;
  bands: ScaleBand[];
};

type Tick = { key: number; x1: number; y1: number; x2: number; y2: number; width: number; color: string };
type BandArc = { d: string; color: string; thickness: number };

export function scaleAngle(spec: ScaleSpec, value: number): number {
  return lvMap(value, spec.min, spec.max, spec.rotation, spec.rotation + spec.sweep);
}

// LVGL's tick value: the i-th of `ticks` mapped onto min..max in integers.
export function tickValue(spec: ScaleSpec, i: number): number {
  return lvMap(i, 0, spec.ticks - 1, spec.min, spec.max);
}

export function isMajorTick(spec: ScaleSpec, i: number): boolean {
  return i % spec.majorEvery === 0;
}

// Ticks run inward from the scale's edge. A tick takes the colour of every
// band its value falls in, the last band winning, as LVGL's scale lines do.
function ticksOf(spec: ScaleSpec): Tick[] {
  const ticks: Tick[] = [];
  for (let i = 0; i < spec.ticks; i++) {
    const value = tickValue(spec, i);
    const major = isMajorTick(spec, i);
    const length = major ? spec.majorLength : spec.tickLength;
    let color = "#ffffff";
    for (const band of spec.bands) if (value >= band.from && value <= band.to) color = band.tickColor;
    const degrees = spec.rotation + (spec.sweep * i) / (spec.ticks - 1);
    const outer = polar(spec.cx, spec.cy, spec.radius, degrees);
    const inner = polar(spec.cx, spec.cy, spec.radius - length, degrees);
    ticks.push({ key: i, x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y, width: major ? spec.majorWidth : spec.tickWidth, color });
  }
  return ticks;
}

function bandArcsOf(spec: ScaleSpec): BandArc[] {
  return spec.bands.map((band) => ({
    d: arcPath(spec.cx, spec.cy, spec.radius - band.thickness / 2, scaleAngle(spec, band.from), scaleAngle(spec, band.to)),
    color: band.color,
    thickness: band.thickness,
  }));
}

// The coloured bands and the tick marks of an LVGL meter scale, inside an
// <svg>. Arcs go down first, ticks over them.
export function GaugeScale(props: { spec: ScaleSpec }) {
  const arcs = bandArcsOf(props.spec);
  const ticks = ticksOf(props.spec);
  return (
    <g>
      {arcs.map((arc) => (
        <path d={arc.d} fill="none" stroke={arc.color} stroke-width={arc.thickness} />
      ))}
      {ticks.map((tick) => (
        <line x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke={tick.color} stroke-width={tick.width} />
      ))}
    </g>
  );
}
