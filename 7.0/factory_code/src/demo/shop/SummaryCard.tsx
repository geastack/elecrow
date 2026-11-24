import { type Stack, StackedBarChart } from "../../components/charts/StackedBarChart";
import { WEEK_SALES } from "../../lib/data";
import { BLUE, GREEN, RED } from "../../lib/palette";

// The demo's fixed shares of each bar: devices, clothes, services.
const DEVICES: number[] = [32, 43, 21, 56, 29, 36, 19];
const CLOTHES: number[] = [12, 19, 23, 31, 27, 32, 32];
const SERVICES: number[] = [56, 38, 56, 13, 44, 32, 49];
const STACKS: Stack[] = DEVICES.map((devices, i) => ({ share: [devices, CLOTHES[i], SERVICES[i]], colors: [RED, BLUE, GREEN] }));
// The Shop chart's own callback names its columns after months.
const LABELS: string[] = ["Jan", "Febr", "March", "Apr", "May", "Jun", "July"];

// LVGL's two-column grid: the figures down the left, the chart filling the
// right column across all five rows, 30 px of padding under it for the
// month names. The chart cell is (716 - 11) / 2 = 353 px by the rows'
// 27 + 18 + 20 + 27 + 18 and four 11 px gaps = 154 px.
export function SummaryCard() {
  return (
    <div class="card summary-card">
      <span class="card-title summary-title">Monthly Summary</span>
      <span class="muted summary-date">8-15 July, 2021</span>
      <span class="card-title summary-amount">$27,123.25</span>
      <div class="summary-hint">
        <svg width={15} height={9} viewBox="0 0 15 9">
          <polyline points="1.5,7.5 7.5,1.5 13.5,7.5" fill="none" stroke={GREEN} stroke-width={3} />
        </svg>
        <span class="growth-text">17% growth this week</span>
      </div>
      <div class="summary-chart">
        <StackedBarChart
          width={353}
          height={154}
          values={WEEK_SALES}
          stacks={STACKS}
          categories={LABELS}
          divisions={6}
          valueCount={6}
          blockGap={24}
        />
      </div>
    </div>
  );
}
