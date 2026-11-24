import { BORDER } from "../../lib/palette";
import { type BarSpec, barPath } from "./BarChart";
import { CategoryLabels, ValueLabels } from "./ChartFrame";
import { divisionsOf, type Plot, plotOf, yOf } from "./plot";

// The demo hides the Shop chart's own bars and paints each one as three
// stacked parts instead, sized as shares of the bar and running from its
// top down: the first part 4 px longer and rounded 4 px to cover the join.
export type Stack = { share: number[]; colors: string[] };

const TOP_RADIUS = 4;

type Part = { key: number; d: string; color: string };

function partsOf(bar: BarSpec, bottom: number, stack: Stack, key: number): Part[] {
  // LVGL's draw area runs 2 px (the bar radius) past the chart's bottom.
  const height = bottom + 2 - bar.y;
  const parts: Part[] = [];
  let top = bar.y;
  for (let i = 0; i < stack.share.length; i++) {
    const length = Math.trunc((stack.share[i] * height) / 100) + (i === 0 ? TOP_RADIUS : 0);
    const start = i === 1 ? top - TOP_RADIUS : top;
    const end = Math.min(start + length + 1, bottom);
    if (end > start) {
      const d =
        i === 0
          ? barPath({ key: bar.key, x: bar.x, y: start, width: bar.width, color: stack.colors[i] }, end, TOP_RADIUS)
          : `M ${bar.x} ${start} H ${bar.x + bar.width} V ${end} H ${bar.x} Z`;
      parts.push({ key: key * 3 + i, d, color: stack.colors[i] });
    }
    top = end;
  }
  return parts;
}

function stackedPartsOf(plot: Plot, values: number[], stacks: Stack[], blockGap: number): Part[] {
  const count = values.length;
  const barWidth = Math.trunc((plot.contentWidth - (count - 1) * blockGap) / count);
  const parts: Part[] = [];
  for (let i = 0; i < count; i++) {
    const bar: BarSpec = {
      key: i,
      x: plot.left + Math.trunc(((plot.contentWidth - barWidth) * i) / (count - 1)),
      y: yOf(plot, values[i]),
      width: barWidth,
      color: "",
    };
    for (const part of partsOf(bar, plot.height, stacks[i], i)) parts.push(part);
  }
  return parts;
}

// LVGL's bar chart as the Shop tab's summary sets it up, in the chart's
// default style (a full rounded border, unlike the Analytics charts): one series, its
// bars painted as stacks, `divisions` horizontal lines and `valueCount`
// labels up the side.
export function StackedBarChart(props: {
  width: number;
  height: number;
  values: number[];
  stacks: Stack[];
  categories: string[];
  divisions: number;
  valueCount: number;
  blockGap: number;
}) {
  const plot = plotOf(props.width, props.height, 1);
  const count = props.values.length;
  const parts = stackedPartsOf(plot, props.values, props.stacks, props.blockGap);
  const blockStep = Math.trunc((plot.contentWidth + props.blockGap) / count);
  const left = plot.left + Math.trunc((blockStep - props.blockGap) / 2);
  const span = plot.contentWidth - (blockStep - props.blockGap);
  const centers: number[] = props.values.map((_, i) => left + Math.trunc(((span - 1) * i) / (count - 1)));
  const divisions = divisionsOf(plot, props.divisions);

  return (
    <div class="chart" style={{ width: props.width, height: props.height }}>
      <svg width={props.width} height={props.height} viewBox={`0 0 ${props.width} ${props.height}`}>
        <rect x={1} y={1} width={props.width - 2} height={props.height - 2} rx={9} fill="none" stroke={BORDER} stroke-width={2} />
        {divisions.map((y) => (
          <rect x={0} y={y} width={props.width} height={1} fill={BORDER} />
        ))}
        {parts.map((part) => (
          <path d={part.d} fill={part.color} />
        ))}
      </svg>
      <ValueLabels plot={plot} count={props.valueCount} />
      <CategoryLabels plot={plot} centers={centers} categories={props.categories} />
    </div>
  );
}
