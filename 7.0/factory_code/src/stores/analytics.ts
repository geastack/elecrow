import { Store } from "@geastack/core";

// One leg of an LVGL animation with playback: `from` to `to` over `upMs`,
// back over `downMs`, forever.
function pingPong(nowMs: number, from: number, to: number, upMs: number, downMs: number): number {
  const t = nowMs % (upMs + downMs);
  if (t < upMs) return from + ((to - from) * t) / upMs;
  return to - ((to - from) * (t - upMs)) / downMs;
}

// A device count of the Sessions meter walks between these bounds.
const SESSIONS_LOW = 1400;
const SESSIONS_HIGH = 4500;
const SESSIONS_STEP_MS = 100;

// LVGL's scroll limit: a press that moves further than this is a drag.
const CHART_DRAG_LIMIT = 6;

// The Analytics tab's meters animate the way the LVGL demo animates them:
// Monthly Target and Network Speed ping-pong on fixed periods, Sessions
// steps each device count on a 100 ms timer.
class AnalyticsStore extends Store {
  revenue = 20;
  sales = 20;
  costs = 20;
  speed = 10;

  desktop = 1000;
  tablet = 1000;
  mobile = 1000;
  desktopDown = false;
  tabletDown = false;
  mobileDown = false;

  startedMs = 0;
  running = false;

  // The chart point under the finger while a chart is held, -1 otherwise
  // (lv_chart's pressed point, which draws the value boxes).
  pressedVisitors = -1;
  pressedRevenue = -1;
  // How far the revenue chart was scrolled when it was pressed, and where
  // the finger landed.
  revenueScroll = 0;
  pressX = 0;
  pressY = 0;

  start() {
    if (this.running) return;
    this.running = true;
    this.startedMs = Date.now();
    setInterval(() => this.stepSessions(), SESSIONS_STEP_MS);
    requestAnimationFrame(() => this.frame());
  }

  pressVisitors(index: number, x: number, y: number) {
    this.pressX = x;
    this.pressY = y;
    this.pressedVisitors = index;
  }

  pressRevenue(index: number, scroll: number, x: number, y: number) {
    this.pressX = x;
    this.pressY = y;
    this.revenueScroll = scroll;
    this.pressedRevenue = index;
  }

  // A finger that starts to drag is scrolling, not holding a point: LVGL
  // drops the press once its scroll limit is passed.
  dragCharts(x: number, y: number) {
    if (this.pressedVisitors < 0 && this.pressedRevenue < 0) return;
    if (Math.abs(x - this.pressX) > CHART_DRAG_LIMIT || Math.abs(y - this.pressY) > CHART_DRAG_LIMIT) this.releaseCharts();
  }

  releaseCharts() {
    this.pressedVisitors = -1;
    this.pressedRevenue = -1;
  }

  frame() {
    const elapsed = Date.now() - this.startedMs;
    this.revenue = Math.round(pingPong(elapsed, 20, 100, 4100, 2700));
    this.sales = Math.round(pingPong(elapsed, 20, 100, 2600, 3200));
    this.costs = Math.round(pingPong(elapsed, 20, 100, 2800, 1800));
    this.speed = Math.round(pingPong(elapsed, 10, 60, 4100, 800));
    requestAnimationFrame(() => this.frame());
  }

  stepSessions() {
    if (this.desktopDown) {
      this.desktop = this.desktop - 137;
      if (this.desktop < SESSIONS_LOW) this.desktopDown = false;
    } else {
      this.desktop = this.desktop + 116;
      if (this.desktop > SESSIONS_HIGH) this.desktopDown = true;
    }
    if (this.tabletDown) {
      this.tablet = this.tablet - 3;
      if (this.tablet < SESSIONS_LOW) this.tabletDown = false;
    } else {
      this.tablet = this.tablet + 9;
      if (this.tablet > SESSIONS_HIGH) this.tabletDown = true;
    }
    if (this.mobileDown) {
      this.mobile = this.mobile - 57;
      if (this.mobile < SESSIONS_LOW) this.mobileDown = false;
    } else {
      this.mobile = this.mobile + 76;
      if (this.mobile > SESSIONS_HIGH) this.mobileDown = true;
    }
  }
}

export const analytics = new AnalyticsStore();
