import { Store } from "@geastack/core";
import { analytics } from "./analytics";
import { theme } from "./theme";

// Which screen is up. The factory firmware walks these in order: the boot
// splash, the CrowPanel menu with its countdown bar, and then the LVGL
// widgets demo for good. The touch check and its corner calibration hang
// off the menu.
export const SCREEN_BOOT = 0;
export const SCREEN_MENU = 1;
export const SCREEN_TOUCH = 2;
export const SCREEN_CALIBRATE = 3;
export const SCREEN_WIDGETS = 4;
// Nothing on screen for a frame between the menu and the widgets demo.
export const SCREEN_NONE = 5;
// How long the blank frame holds, so the menu's memory is released first.
const MENU_RELEASE_MS = 200;
const PAGES_MOUNT_DELAY_MS = 300;

// The splash holds for three seconds before the menu fades in.
const BOOT_HOLD_MS = 3000;
// The countdown bar drops one percent every 35 ms: about 3.5 s from full.
const COUNTDOWN_STEP_MS = 35;
const COUNTDOWN_FULL = 100;
// After the bar empties it reads "Loading" briefly before the demo opens.
const LOADING_HOLD_MS = 150;
// Coming back from the touch check restarts the countdown after a beat.
const COUNTDOWN_RESTART_MS = 100;
// Between calibration corners the finger gets a second to lift.
const CORNER_SETTLE_MS = 1000;
const CORNER_COUNT = 4;

class FlowStore extends Store {
  screen = SCREEN_BOOT;

  // Menu countdown: the bar's fill in percent, and its caption.
  countdown = COUNTDOWN_FULL;
  barText = "0%";
  countdownTimer = 0;
  countdownStartMs = 0;

  homePressed = false;
  touchPressed = false;
  adjustPressed = false;
  returnPressed = false;

  // Touch check: the last point the panel reported.
  touchX = 0;
  touchY = 0;

  // Corner calibration: which corner is lit (0 top-left, 1 bottom-left,
  // 2 top-right, 3 bottom-right) and whether it is waiting for a press.
  corner = 0;
  cornerArmed = false;

  start() {
    this.screen = SCREEN_BOOT;
    setTimeout(() => this.showMenu(), BOOT_HOLD_MS);
  }

  showMenu() {
    this.screen = SCREEN_MENU;
    this.startCountdown(0);
  }

  // --- Menu countdown -------------------------------------------------

  startCountdown(delayMs: number) {
    this.stopCountdown();
    this.countdown = COUNTDOWN_FULL;
    this.barText = `${COUNTDOWN_FULL} %`;
    setTimeout(() => {
      if (this.screen !== SCREEN_MENU) return;
      this.countdownStartMs = Date.now();
      this.countdownTimer = setInterval(() => this.tickCountdown(), COUNTDOWN_STEP_MS);
    }, delayMs);
  }

  stopCountdown() {
    if (this.countdownTimer !== 0) clearInterval(this.countdownTimer);
    this.countdownTimer = 0;
  }

  // The bar follows the clock, not the tick count, so a slow frame never
  // stretches the 3.5 s countdown.
  tickCountdown() {
    const left = COUNTDOWN_FULL - Math.floor((Date.now() - this.countdownStartMs) / COUNTDOWN_STEP_MS);
    if (left > 1) {
      if (left === this.countdown) return;
      this.countdown = left;
      this.barText = `${left} %`;
      return;
    }
    this.stopCountdown();
    this.barText = "Loading";
    setTimeout(() => this.openWidgets(), LOADING_HOLD_MS);
  }

  // The menu's artwork is freed before the demo mounts: with all three tab
  // pages mounted at once the two together do not fit in PSRAM.
  openWidgets() {
    if (this.screen === SCREEN_WIDGETS || this.screen === SCREEN_NONE) return;
    this.stopCountdown();
    this.screen = SCREEN_NONE;
    setTimeout(() => {
      this.screen = SCREEN_WIDGETS;
      analytics.start();
      // The pages beside the open one mount once the demo is up.
      setTimeout(() => theme.mountAllPages(), PAGES_MOUNT_DELAY_MS);
    }, MENU_RELEASE_MS);
  }

  // --- Menu buttons ---------------------------------------------------

  pressHome(down: boolean) {
    this.homePressed = down;
    if (!down) this.openWidgets();
  }

  pressTouch(down: boolean) {
    this.touchPressed = down;
    if (down) return;
    this.stopCountdown();
    this.touchX = 0;
    this.touchY = 0;
    this.screen = SCREEN_TOUCH;
  }

  // --- Touch check ----------------------------------------------------

  report(x: number, y: number) {
    this.touchX = Math.round(x);
    this.touchY = Math.round(y);
  }

  pressAdjust(down: boolean) {
    this.adjustPressed = down;
    if (down) return;
    this.corner = 0;
    this.cornerArmed = true;
    this.screen = SCREEN_CALIBRATE;
    console.log("touch calibration: press each lit corner");
  }

  pressReturn(down: boolean) {
    this.returnPressed = down;
    if (down) return;
    this.screen = SCREEN_MENU;
    this.startCountdown(COUNTDOWN_RESTART_MS);
  }

  // --- Corner calibration ---------------------------------------------

  // A press anywhere while a corner is lit samples that corner; the
  // coordinates go to the serial log, as the factory firmware does.
  sampleCorner(x: number, y: number) {
    if (!this.cornerArmed) return;
    this.cornerArmed = false;
    console.log(`calibration corner ${this.corner}: x=${Math.round(x)} y=${Math.round(y)}`);
    if (this.corner + 1 >= CORNER_COUNT) {
      setTimeout(() => this.finishCalibration(), CORNER_SETTLE_MS);
      return;
    }
    setTimeout(() => {
      this.corner = this.corner + 1;
      this.cornerArmed = true;
    }, CORNER_SETTLE_MS);
  }

  finishCalibration() {
    this.touchX = 0;
    this.touchY = 0;
    this.screen = SCREEN_TOUCH;
  }
}

export const flow = new FlowStore();
