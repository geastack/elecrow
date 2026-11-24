// LVGL 8's chart geometry at 800 px (130 DPI), so the SVG charts land on
// the same pixels. A chart object has the card style with the small
// padding: 11 px padding plus a 2 px border, which LVGL takes off every
// side even though the demo only draws the left and bottom border.
export const CHART_INSET = 13;
export const CHART_BORDER = 2;
// Montserrat 16's line height, for the axis labels.
export const LABEL_HEIGHT = 18;
// The axis labels sit 2 px (the ticks' padding) off the chart.
export const LABEL_GAP = 2;

export type Plot = {
  // The chart object's size.
  width: number;
  height: number;
  // The content box the series are scaled into, `zoom` times wider than
  // the object when the chart scrolls.
  left: number;
  top: number;
  contentWidth: number;
  contentHeight: number;
};

export function plotOf(width: number, height: number, zoom: number): Plot {
  return {
    width,
    height,
    left: CHART_INSET,
    top: CHART_INSET,
    contentWidth: (width - 2 * CHART_INSET) * zoom,
    contentHeight: height - 2 * CHART_INSET,
  };
}

// LVGL's integer value-to-pixel mapping for the 0-100 range.
export function yOf(plot: Plot, value: number): number {
  return plot.top + plot.contentHeight - Math.trunc((value * plot.contentHeight) / 100);
}

// The y of the i-th of `count` evenly spaced value labels, top to bottom.
export function valueTickY(plot: Plot, i: number, count: number): number {
  return plot.top + Math.trunc(((plot.contentHeight - 1) * i) / (count - 1));
}

// The y of each of `count` horizontal division lines, top to bottom.
export function divisionsOf(plot: Plot, count: number): number[] {
  const lines: number[] = [];
  for (let i = 0; i < count; i++) lines.push(plot.top + Math.trunc((plot.contentHeight * i) / (count - 1)));
  return lines;
}
