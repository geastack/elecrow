// LVGL's Analytics tab at 800 px. The tab page is a wrapping flex row with
// 20 px padding and gaps, so its content is 760 x 370.

// The two chart cards are 760 wide and 100% tall capped at 300. Inside the
// card's 716 x 256 content, a 20 px axis column and an 11 px gap leave the
// chart 685 wide; the 27 px title row, a 10 px row for the month names and
// two 11 px gaps leave it 197 tall.
export const CHART_W = 685;
export const CHART_H = 197;
// The chart's left edge on screen: the page's 20 px padding, the card's 2 px
// border and 20 px padding, the axis column and the gap.
export const CHART_LEFT = 20 + 2 + 20 + 20 + 11;

// Three meter cards share a row: (760 - 2 * 20) / 3 = 240 px each, so a
// meter is the card's 196 px content width, square.
export const METER_SIZE = 196;
export const METER_CENTER = METER_SIZE / 2;
export const METER_RADIUS = METER_SIZE / 2;
