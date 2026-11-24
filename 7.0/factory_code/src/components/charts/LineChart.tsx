import { BORDER } from "../../lib/palette";
import { CategoryLabels, ChartBorder, ValueLabels } from "./ChartFrame";
import { type Plot, plotOf, yOf } from "./plot";
import { BOX_CENTER, ValueBox } from "./ValueBox";

// LVGL's series line is 2 px wide with 7 px round points (3 and 8 dp).
const LINE_WIDTH = 2;
const POINT_RADIUS = 3.5;
// The demo fills under the line at 50% opacity through a fade mask: fully
// on down to an eighth of the chart's height, then fading linearly to
// transparent at its bottom edge (lv_draw_mask_fade from y1 + h / 8 to y2).
const AREA_OPACITY = 0.5;

type Point = { x: number; y: number };

// The area under the line, down to `bottom`.
function areaPath(points: Point[], bottom: number): string {
  let d = `M ${points[0].x} ${bottom}`;
  for (const p of points) d = `${d} L ${p.x} ${p.y}`;
  return `${d} L ${points[points.length - 1].x} ${bottom} Z`;
}

// lv_chart's pressed point for a line chart: the nearest point to `x`, the
// finger's distance from the chart's left edge (get_index_from_x).
export function linePointIndex(width: number, height: number, count: number, x: number): number {
  const plot = plotOf(width, height, 1);
  const into = x - plot.left;
  if (into < 0) return 0;
  if (into > plot.contentWidth) return count - 1;
  return Math.trunc((into * (count - 1) + plot.contentWidth / 2) / plot.contentWidth);
}

// The points' pixel centres, so the 2 px line and the points sit where LVGL
// puts them.
function linePoints(plot: Plot, values: number[]): Point[] {
  const count = values.length;
  return values.map((value, i) => ({
    x: plot.left + Math.trunc((plot.contentWidth * i) / (count - 1)) + 0.5,
    y: yOf(plot, value) + 0.5,
  }));
}

// LVGL's line chart as the widgets demo sets it up: one vertical division
// line per point, the left and bottom border, values 0-100 on the left and
// a category under each point.
export function LineChart(props: { width: number; height: number; values: number[]; categories: string[]; color: string }) {
  const plot = plotOf(props.width, props.height, 1);
  const count = props.values.length;
  const xs: number[] = props.values.map((_, i) => plot.left + Math.trunc((plot.contentWidth * i) / (count - 1)));
  // The labels centre on the ticks, which LVGL spaces one pixel tighter.
  const centers: number[] = props.values.map((_, i) => plot.left + Math.trunc(((plot.contentWidth - 1) * i) / (count - 1)));
  const points = linePoints(plot, props.values);
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const fadeTop = Math.trunc(plot.height / 8);
  const fadeId = `fade-${props.color.replace("#", "")}`;

  return (
    <div class="chart" style={{ width: props.width, height: props.height }}>
      <svg width={props.width} height={props.height} viewBox={`0 0 ${props.width} ${props.height}`}>
        <ChartBorder plot={plot} />
        {xs.map((x) => (
          <rect x={x} y={0} width={1} height={props.height} fill={BORDER} />
        ))}
        <defs>
          <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1={0} y1={fadeTop} x2={0} y2={plot.height}>
            <stop offset={0} stop-color={props.color} stop-opacity={AREA_OPACITY} />
            <stop offset={1} stop-color={props.color} stop-opacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath(points, plot.height)} fill={`url(#${fadeId})`} stroke="none" />
        <polyline points={line} fill="none" stroke={props.color} stroke-width={LINE_WIDTH} stroke-linejoin="round" />
        {points.map((point) => (
          <circle cx={point.x} cy={point.y} r={POINT_RADIUS} fill={props.color} />
        ))}
      </svg>
      <ValueLabels plot={plot} count={5} />
      <CategoryLabels plot={plot} centers={centers} categories={props.categories} />
    </div>
  );
}

// Holding a line chart rings the held point in LVGL's 2 px white outline
// and shows its value above it. It lies over the chart, apart from it, so a
// press redraws only this.
export function LinePress(props: { width: number; height: number; values: number[]; color: string; pressed: number }) {
  const plot = plotOf(props.width, props.height, 1);
  const point = linePoints(plot, props.values)[props.pressed];
  return (
    <div class="chart-press" style={{ width: props.width, height: props.height }}>
      <svg width={props.width} height={props.height} viewBox={`0 0 ${props.width} ${props.height}`}>
        <circle cx={point.x} cy={point.y} r={POINT_RADIUS + 2} fill="#ffffff" />
        <circle cx={point.x} cy={point.y} r={POINT_RADIUS} fill={props.color} />
      </svg>
      <ValueBox x={point.x} top={Math.trunc(point.y) - 4} value={props.values[props.pressed]} color={props.color} align={BOX_CENTER} />
    </div>
  );
}
