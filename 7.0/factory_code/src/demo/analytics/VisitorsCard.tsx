import { LineChart, LinePress, linePointIndex } from "../../components/charts/LineChart";
import { MONTHS, VISITORS } from "../../lib/data";
import { analytics } from "../../stores/analytics";
import { theme } from "../../stores/theme";
import { CHART_H, CHART_LEFT, CHART_W } from "./sizes";

// Holding the chart shows the nearest point's value; the highlight and the
// finger's target are layers over the chart, so a press redraws neither the
// chart nor the target under the finger.
export function VisitorsCard() {
  return (
    <div class="card chart-card">
      <span class="card-title chart-card-title">Unique visitors</span>
      <div class="chart-card-chart">
        <LineChart width={CHART_W} height={CHART_H} values={VISITORS} categories={MONTHS} color={theme.primary} />
        {analytics.pressedVisitors >= 0 ? (
          <LinePress
            width={CHART_W}
            height={CHART_H}
            values={VISITORS}
            color={theme.primary}
            pressed={analytics.pressedVisitors}
          />
        ) : null}
        <div
          class="chart-hit"
          style={{ width: CHART_W, height: CHART_H }}
          onPointerDown={(event) =>
            analytics.pressVisitors(
              linePointIndex(CHART_W, CHART_H, VISITORS.length, event.clientX - CHART_LEFT),
              event.clientX,
              event.clientY,
            )
          }
          onPointerMove={(event) => analytics.dragCharts(event.clientX, event.clientY)}
          onPointerUp={() => analytics.releaseCharts()}
          onPointerCancel={() => analytics.releaseCharts()}
        />
      </div>
    </div>
  );
}
