import { BORDER, GREY } from "../../lib/palette";
import { CHART_BORDER, LABEL_GAP, LABEL_HEIGHT, type Plot, valueTickY } from "./plot";
import "./charts.css";

// Wide enough for "100" in Montserrat 16; the labels are right-aligned.
const VALUE_LABEL_WIDTH = 40;
// Wide enough for the longest month name; the labels are centred.
const CATEGORY_LABEL_WIDTH = 60;

type Label = { text: string; left: number; top: number };

// The chart's left and bottom border, under everything else.
export function ChartBorder(props: { plot: Plot }) {
  const width = props.plot.width;
  const height = props.plot.height;
  return (
    <g>
      <rect x={0} y={0} width={CHART_BORDER} height={height} fill={BORDER} />
      <rect x={0} y={height - CHART_BORDER} width={width} height={CHART_BORDER} fill={BORDER} />
    </g>
  );
}

// LVGL's 0-100 axis: `count` labels from the top of the content box to its
// bottom, right-aligned 3 px left of the chart.
function valueLabelsOf(plot: Plot, count: number): Label[] {
  const labels: Label[] = [];
  for (let i = 0; i < count; i++) {
    labels.push({
      text: `${Math.round((100 * (count - 1 - i)) / (count - 1))}`,
      left: -1 - LABEL_GAP - VALUE_LABEL_WIDTH,
      top: valueTickY(plot, i, count) - LABEL_HEIGHT / 2,
    });
  }
  return labels;
}

export function ValueLabels(props: { plot: Plot; count: number }) {
  const labels = valueLabelsOf(props.plot, props.count);
  return (
    <div class="chart-labels">
      {labels.map((label) => (
        <span class="value-label" style={{ left: label.left, top: label.top, color: GREY }}>
          {label.text}
        </span>
      ))}
    </div>
  );
}

// The category names, each centred on its tick, 2 px under the chart.
export function CategoryLabels(props: { plot: Plot; centers: number[]; categories: string[] }) {
  const labels: Label[] = props.categories.map((text, i) => ({
    text,
    left: props.centers[i] - CATEGORY_LABEL_WIDTH / 2,
    top: props.plot.height + LABEL_GAP,
  }));
  return (
    <div class="chart-labels">
      {labels.map((label) => (
        <span class="category-label" style={{ left: label.left, top: label.top, color: GREY }}>
          {label.text}
        </span>
      ))}
    </div>
  );
}
