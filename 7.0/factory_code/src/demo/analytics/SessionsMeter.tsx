import { BLUE, GREEN, RED } from "../../lib/palette";
import { analytics } from "../../stores/analytics";
import { meterArc, sessionAngle, sessionShare } from "./meter";
import { METER_RADIUS, METER_SIZE } from "./sizes";

function desktopTo(desktop: number, tablet: number, mobile: number): number {
  return sessionAngle(sessionShare(desktop, desktop, tablet, mobile));
}

function tabletFrom(desktop: number, tablet: number, mobile: number): number {
  return sessionAngle(sessionShare(desktop, desktop, tablet, mobile) + 1);
}

function tabletTo(desktop: number, tablet: number, mobile: number): number {
  return sessionAngle(sessionShare(desktop, desktop, tablet, mobile) + 1 + sessionShare(tablet, desktop, tablet, mobile));
}

function mobileFrom(desktop: number, tablet: number, mobile: number): number {
  return sessionAngle(sessionShare(desktop, desktop, tablet, mobile) + 2 + sessionShare(tablet, desktop, tablet, mobile));
}

// A full ring split three ways by each device's share: red 20 px at 10 px
// in, blue 30 px on the edge, green 10 px at 20 px in.
export function SessionsMeter() {
  return (
    <div class="card meter-card">
      <span class="card-title">Sessions</span>
      {/* One svg per arc, so a share change repaints only the arcs it moves. */}
      <div class="meter">
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path
            d={meterArc(METER_RADIUS - 10, 20, sessionAngle(0), desktopTo(analytics.desktop, analytics.tablet, analytics.mobile))}
            fill="none"
            stroke={RED}
            stroke-width={20}
          />
        </svg>
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path
            d={meterArc(
              METER_RADIUS,
              30,
              tabletFrom(analytics.desktop, analytics.tablet, analytics.mobile),
              tabletTo(analytics.desktop, analytics.tablet, analytics.mobile),
            )}
            fill="none"
            stroke={BLUE}
            stroke-width={30}
          />
        </svg>
        <svg class="meter-layer" width={METER_SIZE} height={METER_SIZE} viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}>
          <path
            d={meterArc(METER_RADIUS - 20, 10, mobileFrom(analytics.desktop, analytics.tablet, analytics.mobile), sessionAngle(99))}
            fill="none"
            stroke={GREEN}
            stroke-width={10}
          />
        </svg>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: RED }} />
        <span class="legend-text">{`Desktop: ${analytics.desktop}`}</span>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: BLUE }} />
        <span class="legend-text">{`Tablet: ${analytics.tablet}`}</span>
      </div>
      <div class="legend">
        <div class="bullet" style={{ backgroundColor: GREEN }} />
        <span class="legend-text">{`Mobile: ${analytics.mobile}`}</span>
      </div>
    </div>
  );
}
