import { BLUE, GREEN, RED } from "../../lib/palette";
import { analytics } from "../../stores/analytics";
import { meterArc, targetAngle } from "./meter";
import { METER_RADIUS, METER_SIZE } from "./sizes";

// Three 15 px arcs 20 px apart. The bullets are red, blue, green whatever
// the arcs draw, as in the LVGL demo.
export function TargetMeter() {
  return (
    <div class="card meter-card">
      <span class="card-title">Monthly Target</span>
      {/* One svg per arc: each scene's damage is its own arc's moving tip,
          where one svg would repaint the box spanning all three tips. */}
      <div class="meter">
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path d={meterArc(METER_RADIUS, 15, 90, targetAngle(analytics.revenue))} fill="none" stroke={BLUE} stroke-width={15} />
        </svg>
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path d={meterArc(METER_RADIUS - 20, 15, 90, targetAngle(analytics.sales))} fill="none" stroke={RED} stroke-width={15} />
        </svg>
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path d={meterArc(METER_RADIUS - 40, 15, 90, targetAngle(analytics.costs))} fill="none" stroke={GREEN} stroke-width={15} />
        </svg>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: RED }} />
        <span class="legend-text">{`Revenue: ${analytics.revenue} %`}</span>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: BLUE }} />
        <span class="legend-text">{`Sales: ${analytics.sales} %`}</span>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: GREEN }} />
        <span class="legend-text">{`Costs: ${analytics.costs} %`}</span>
      </div>
    </div>
  );
}
