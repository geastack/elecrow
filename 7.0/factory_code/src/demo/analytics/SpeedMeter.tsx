import { GaugeScale, isMajorTick, type ScaleSpec, scaleAngle, tickValue } from "../../components/charts/GaugeScale";
import { Legend } from "../../components/Legend";
import { polar } from "../../lib/geometry";
import { BLUE, BLUE_DARK, GREEN, GREEN_DARK, GREY_DARKEN_1, GREY_DARKEN_4, RED, RED_DARK } from "../../lib/palette";
import { analytics } from "../../stores/analytics";
import { METER_SIZE } from "./sizes";

// The demo pads this meter 10 px left and right, so its scale is 176 px
// across, centred horizontally and hanging from the top of the square.
const PAD = 10;
const RADIUS = (METER_SIZE - 2 * PAD) / 2;
const CX = PAD + RADIUS;
const CY = RADIUS;

// 10 to 60 Mbps over 220 degrees from 140: 21 ticks 3 px wide and 17 long,
// every fourth one 4 px wide and 22 long with its value 15 px inside it.
const SCALE: ScaleSpec = {
  cx: CX,
  cy: CY,
  radius: RADIUS,
  rotation: 140,
  sweep: 220,
  min: 10,
  max: 60,
  ticks: 21,
  tickWidth: 3,
  tickLength: 17,
  majorEvery: 4,
  majorWidth: 4,
  majorLength: 22,
  bands: [
    { from: 0, to: 20, color: RED, tickColor: RED_DARK, thickness: 10 },
    { from: 20, to: 40, color: BLUE, tickColor: BLUE_DARK, thickness: 12 },
    { from: 40, to: 60, color: GREEN, tickColor: GREEN_DARK, thickness: 10 },
  ],
};
const LABEL_RADIUS = RADIUS - 22 - 15;
const LABEL_WIDTH = 30;
const LABEL_HEIGHT = 18;
// The needle stops 25 px short of the edge; its pivot is an 11 px dot with
// a 3 px white outline.
const NEEDLE_LENGTH = RADIUS - 25;
const PIVOT_RADIUS = 5.5;
const PIVOT_OUTLINE = 3;

type Label = { text: string; left: number; top: number };

function labelsOf(spec: ScaleSpec): Label[] {
  const labels: Label[] = [];
  for (let i = 0; i < spec.ticks; i++) {
    if (!isMajorTick(spec, i)) continue;
    const at = polar(CX, CY, LABEL_RADIUS, spec.rotation + (spec.sweep * i) / (spec.ticks - 1));
    labels.push({ text: `${tickValue(spec, i)}`, left: Math.round(at.x - LABEL_WIDTH / 2), top: Math.round(at.y - LABEL_HEIGHT / 2) });
  }
  return labels;
}

const LABELS: Label[] = labelsOf(SCALE);

// The needle's tip, bound straight to the line so it patches in place.
function needleX(speed: number): number {
  return polar(CX, CY, NEEDLE_LENGTH, scaleAngle(SCALE, speed)).x;
}

function needleY(speed: number): number {
  return polar(CX, CY, NEEDLE_LENGTH, scaleAngle(SCALE, speed)).y;
}

export function SpeedMeter() {
  return (
    <div class="card meter-card">
      <span class="card-title">Network Speed</span>
      <div class="meter">
        {/* The scale never changes, so it is its own svg and paints once into
            the static backdrop; only the needle svg over it redraws. */}
        <svg width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <GaugeScale spec={SCALE} />
        </svg>
        <svg class="meter-needle" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <line x1={CX} y1={CY} x2={needleX(analytics.speed)} y2={needleY(analytics.speed)} stroke={GREY_DARKEN_4} stroke-width={4} />
          <circle cx={CX} cy={CY} r={PIVOT_RADIUS + PIVOT_OUTLINE} fill="#ffffff" />
          <circle cx={CX} cy={CY} r={PIVOT_RADIUS} fill={GREY_DARKEN_4} />
        </svg>
        {LABELS.map((label) => (
          <span class="gauge-label" style={{ left: label.left, top: label.top, color: GREY_DARKEN_1 }}>
            {label.text}
          </span>
        ))}
        <span class="gauge-value">{`${analytics.speed}`}</span>
        <span class="gauge-unit">Mbps</span>
      </div>
      <Legend color={RED} text="Low speed" />
      <Legend color={BLUE} text="Normal Speed" />
      <Legend color={GREEN} text="High Speed" />
    </div>
  );
}
