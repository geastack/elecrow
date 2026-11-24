import { BarChart, BarPress, barBlockIndex } from "../../components/charts/BarChart";
import { REVENUE_LAST_YEAR, REVENUE_THIS_YEAR } from "../../lib/data";
import { GREY_LIGHTEN_1 } from "../../lib/palette";
import { analytics } from "../../stores/analytics";
import { theme } from "../../stores/theme";
import { CHART_H, CHART_LEFT, CHART_W } from "./sizes";

// The demo labels the revenue bars with Roman numerals.
const MONTH_NUMERALS: string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SERIES: number[][] = [REVENUE_LAST_YEAR, REVENUE_THIS_YEAR];
// Twice as wide as the card, so it scrolls sideways; six division lines
// and 16 px between the months (the default theme's 10 dp gap otherwise).
const ZOOM = 2;
const BLOCK_GAP = 16;
const SERIES_GAP = 2;

function chartScroll(): number {
  const scroller = document.querySelector(".chart-scroll");
  return scroller ? (scroller.scrollLeft ?? 0) : 0;
}

function press(x: number, y: number) {
  const scroll = chartScroll();
  analytics.pressRevenue(barBlockIndex(CHART_W, CHART_H, ZOOM, MONTH_NUMERALS.length, x - CHART_LEFT + scroll), scroll, x, y);
}

// Holding the chart makes the month under the finger glow; the highlight
// and the finger's target are layers over the chart, so a press redraws
// neither the chart nor the target under the finger.
export function RevenueCard() {
  return (
    <div class="card chart-card">
      <span class="card-title chart-card-title">Monthly revenue</span>
      <div class="chart-card-chart">
        <BarChart
          width={CHART_W}
          height={CHART_H}
          zoom={ZOOM}
          series={SERIES}
          colors={[GREY_LIGHTEN_1, theme.primary]}
          categories={MONTH_NUMERALS}
          divisions={6}
          blockGap={BLOCK_GAP}
          seriesGap={SERIES_GAP}
        />
        {analytics.pressedRevenue >= 0 ? (
          <BarPress
            width={CHART_W}
            height={CHART_H}
            zoom={ZOOM}
            series={SERIES}
            colors={[GREY_LIGHTEN_1, theme.primary]}
            blockGap={BLOCK_GAP}
            seriesGap={SERIES_GAP}
            pressed={analytics.pressedRevenue}
            scroll={analytics.revenueScroll}
          />
        ) : null}
        <div
          class="chart-hit"
          style={{ width: CHART_W, height: CHART_H }}
          onPointerDown={(event) => press(event.clientX, event.clientY)}
          onPointerMove={(event) => analytics.dragCharts(event.clientX, event.clientY)}
          onPointerUp={() => analytics.releaseCharts()}
          onPointerCancel={() => analytics.releaseCharts()}
        />
      </div>
    </div>
  );
}
