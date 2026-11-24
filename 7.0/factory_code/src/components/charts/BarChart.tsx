import { BORDER } from "../../lib/palette";
import { CategoryLabels, ValueLabels } from "./ChartFrame";
import { CHART_BORDER, divisionsOf, LABEL_GAP, LABEL_HEIGHT, type Plot, plotOf, yOf } from "./plot";
import { BOX_FROM, BOX_TO, ValueBox } from "./ValueBox";

// lv_chart's glow under a pressed bar: a 15 px shadow in the series colour,
// reaching 7 px past the bar and fading out. Drawn as rings of rounded
// rects, each a pixel wider than the last and faint enough that they add
// up to about half strength at the bar's edge.
const GLOW_RINGS = [1, 2, 3, 4, 5, 6, 7];
const GLOW_OPACITY = 0.09;

// LVGL's bar radius at 130 DPI (3 dp); the bottom corners are clipped off.
export const BAR_RADIUS = 2;

export type BarSpec = { key: number; x: number; y: number; width: number; color: string };

// A bar with only its top corners rounded, standing on the chart's bottom
// edge, as LVGL draws it over the border.
export function barPath(bar: BarSpec, bottom: number, radius: number): string {
  const r = Math.min(radius, bar.width / 2, (bottom - bar.y) / 2);
  const right = bar.x + bar.width;
  return `M ${bar.x} ${bottom} V ${bar.y + r} A ${r} ${r} 0 0 1 ${bar.x + r} ${bar.y} H ${right - r} A ${r} ${r} 0 0 1 ${right} ${bar.y + r} V ${bottom} Z`;
}

// LVGL's bar layout: blocks `blockGap` apart (scaled with the zoom), one
// column per series inside each block, `seriesGap` apart.
function barsOf(plot: Plot, series: number[][], colors: string[], blockGap: number, seriesGap: number): BarSpec[] {
  const count = series[0].length;
  const blockWidth = Math.trunc((plot.contentWidth - (count - 1) * blockGap) / count);
  const columnWidth = Math.trunc((blockWidth - (series.length - 1) * seriesGap) / series.length);
  const bars: BarSpec[] = [];
  for (let i = 0; i < count; i++) {
    const blockX = plot.left + Math.trunc(((plot.contentWidth - blockWidth) * i) / (count - 1));
    for (let s = 0; s < series.length; s++) {
      bars.push({
        key: i * series.length + s,
        x: blockX + s * (columnWidth + seriesGap),
        y: yOf(plot, series[s][i]),
        width: columnWidth,
        color: colors[s],
      });
    }
  }
  return bars;
}

// The x axis of a bar chart puts each label under the middle of its block.
function blockCenters(plot: Plot, count: number, blockGap: number): number[] {
  const blockStep = Math.trunc((plot.contentWidth + blockGap) / count);
  const left = plot.left + Math.trunc((blockStep - blockGap) / 2);
  const span = plot.contentWidth - (blockStep - blockGap);
  const centers: number[] = [];
  for (let i = 0; i < count; i++) centers.push(left + Math.trunc(((span - 1) * i) / (count - 1)));
  return centers;
}

// lv_chart's pressed block for a bar chart: the month under `x`, the
// finger's distance from the left edge of the scrolled content
// (get_index_from_x).
export function barBlockIndex(width: number, height: number, zoom: number, count: number, x: number): number {
  const plot = plotOf(width, height, zoom);
  const into = x - plot.left;
  if (into < 0) return 0;
  if (into > plot.contentWidth) return count - 1;
  const index = Math.trunc((into * count) / plot.contentWidth);
  return index > count - 1 ? count - 1 : index;
}

// LVGL's bar chart as the widgets demo's "Monthly revenue": horizontal
// division lines, values 0-100 on the left, and `zoom` times wider than the
// chart, scrolling sideways under the fixed axis and division lines.
export function BarChart(props: {
  width: number;
  height: number;
  zoom: number;
  series: number[][];
  colors: string[];
  categories: string[];
  divisions: number;
  blockGap: number;
  seriesGap: number;
}) {
  const plot = plotOf(props.width, props.height, props.zoom);
  const blockGap = props.blockGap * props.zoom;
  const seriesGap = props.seriesGap * props.zoom;
  const bars = barsOf(plot, props.series, props.colors, blockGap, seriesGap);
  const centers = blockCenters(plot, props.categories.length, blockGap);
  const divisions = divisionsOf(plot, props.divisions);
  // The scrolled content: the series plus the padding on either side.
  const scrollWidth = plot.contentWidth + 2 * plot.left;
  const scrollHeight = props.height + LABEL_GAP + LABEL_HEIGHT;

  // The division lines and the bottom border are horizontal, so they look the
  // same scrolled or not: they ride in the scrolled content, and only the left
  // border stays fixed beside it. The scroller starts right of that border and
  // its content sits the border's width to the left, so every pixel lands
  // where a full-width scroller would put it, while nothing fixed overlaps the
  // scroller: a sideways scroll frame shifts the chart's pixels and paints the
  // exposed strip, with no overlay to repaint each frame.
  // Every shape is a box -- lines, and bars with their top corners rounded --
  // so they paint as plain fills: through the SVG rasterizer each exposed
  // strip and each overlay repaint cost a millisecond or more.
  return (
    <div class="chart" style={{ width: props.width, height: props.height }}>
      <div class="chart-box" style={{ width: CHART_BORDER, height: props.height, backgroundColor: BORDER }} />
      <div class="chart-scroll" style={{ left: CHART_BORDER, width: props.width - CHART_BORDER, height: scrollHeight }}>
        <div class="chart-scroll-content" style={{ left: -CHART_BORDER, width: scrollWidth, height: scrollHeight }}>
          <div
            class="chart-box"
            style={{ top: props.height - CHART_BORDER, width: scrollWidth, height: CHART_BORDER, backgroundColor: BORDER }}
          />
          {divisions.map((y) => (
            <div class="chart-box" style={{ top: y, width: scrollWidth, height: 1, backgroundColor: BORDER }} />
          ))}
          {bars.map((bar) => (
            <div
              class="chart-bar"
              style={{
                left: bar.x,
                top: bar.y,
                width: bar.width,
                height: props.height - bar.y,
                backgroundColor: bar.color,
              }}
            />
          ))}
          <CategoryLabels plot={plot} centers={centers} categories={props.categories} />
        </div>
      </div>
      <ValueLabels plot={plot} count={5} />
    </div>
  );
}

// The value boxes stand above the chart, so the press layer reaches this
// far above it.
const PRESS_HEADROOM = 40;

// Holding a bar chart makes the month's bars glow and shows each value
// beside the bar's middle, away from the other bar: lv_chart keeps its
// series newest first, so the demo's first series (the left bar) ends its
// box at the middle and the second (the right bar) starts its box there. It lies over the chart, apart from it, so a press
// redraws only this; `scroll` is how far the chart was scrolled sideways.
export function BarPress(props: {
  width: number;
  height: number;
  zoom: number;
  series: number[][];
  colors: string[];
  blockGap: number;
  seriesGap: number;
  pressed: number;
  scroll: number;
}) {
  const plot = plotOf(props.width, props.height, props.zoom);
  const bars = barsOf(plot, props.series, props.colors, props.blockGap * props.zoom, props.seriesGap * props.zoom);
  const scrollWidth = plot.contentWidth + 2 * plot.left;
  const first = bars[props.pressed * props.series.length];
  const second = bars[props.pressed * props.series.length + 1];
  return (
    <div class="chart-press chart-press-clip" style={{ top: -PRESS_HEADROOM, width: props.width, height: props.height + PRESS_HEADROOM }}>
      <div class="chart-press" style={{ left: -props.scroll, top: PRESS_HEADROOM, width: scrollWidth, height: props.height }}>
        <svg width={scrollWidth} height={props.height} viewBox={`0 0 ${scrollWidth} ${props.height}`}>
          {GLOW_RINGS.map((k) => (
            <rect
              x={first.x - k}
              y={first.y - k}
              width={first.width + 2 * k}
              height={props.height - first.y + k}
              rx={BAR_RADIUS + k}
              fill={first.color}
              opacity={GLOW_OPACITY}
            />
          ))}
          {GLOW_RINGS.map((k) => (
            <rect
              x={second.x - k}
              y={second.y - k}
              width={second.width + 2 * k}
              height={props.height - second.y + k}
              rx={BAR_RADIUS + k}
              fill={second.color}
              opacity={GLOW_OPACITY}
            />
          ))}
          <path d={barPath(first, props.height, BAR_RADIUS)} fill={first.color} />
          <path d={barPath(second, props.height, BAR_RADIUS)} fill={second.color} />
        </svg>
        <ValueBox x={first.x + first.width / 2} top={first.y} value={props.series[0][props.pressed]} color={first.color} align={BOX_TO} />
        <ValueBox x={second.x + second.width / 2} top={second.y} value={props.series[1][props.pressed]} color={second.color} align={BOX_FROM} />
      </div>
    </div>
  );
}
