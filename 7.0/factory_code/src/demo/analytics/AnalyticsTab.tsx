import { RevenueCard } from "./RevenueCard";
import { SessionsMeter } from "./SessionsMeter";
import { SpeedMeter } from "./SpeedMeter";
import { TargetMeter } from "./TargetMeter";
import { VisitorsCard } from "./VisitorsCard";
import "./analytics.css";

// Analytics: two charts the width of the screen, then three animated meters
// side by side.
export function AnalyticsTab() {
  return (
    <div class="tab-page" momentum>
      <VisitorsCard />
      <RevenueCard />
      <div class="card-row">
        <TargetMeter />
        <SessionsMeter />
        <SpeedMeter />
      </div>
    </div>
  );
}
