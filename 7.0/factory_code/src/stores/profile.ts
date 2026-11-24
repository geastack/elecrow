import { Store } from "@geastack/core";

// The Experience slider's track, in screen pixels: the right card starts at
// 20 + 370 + 20 = 410, its content 22 px in (border and padding), and the
// 309 px track is centred in that 326 px content, 8 px in.
export const SLIDER_LEFT = 440;
export const SLIDER_WIDTH = 309;

export const GENDERS: string[] = ["Male", "Female", "Other"];

// lv_calendar_header_dropdown's lists: 2023 down to 1901, and 01..12.
export const CALENDAR_YEARS: string[] = [];
for (let year = 2023; year >= 1901; year--) CALENDAR_YEARS.push(String(year));
export const CALENDAR_MONTHS: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

// lv_dropdown_open scrolls the list so the selected option's line (18 px
// text + 16 px spacing) is at the top. The list mounts on the next frame and
// is laid out by the one after; a scrollTop set before its layout clamps to 0.
function scrollListTo(index: number) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const list = document.querySelector(".calendar-dropdown-list");
      if (list) list.scrollTop = index * 34;
    }),
  );
}

class ProfileStore extends Store {
  userName = "";
  password = "";
  gender = GENDERS[0];
  genderOpen = false;
  birthday = "";
  // The birthday calendar (LVGL opens it on the layer above the demo when the
  // field is focused, showing January 1990).
  calendarOpen = false;
  shownYear = 1990;
  shownMonth = 1;
  yearListOpen = false;
  monthListOpen = false;
  experience = 0;
  sliding = false;
  hardWorking = false;
  teamPlayer = false;
  logOutPressed = false;

  setUserName(value: string) {
    this.userName = value;
  }

  setPassword(value: string) {
    this.password = value;
  }

  setGender(value: string) {
    this.gender = value;
    this.genderOpen = false;
  }

  toggleGender() {
    this.genderOpen = !this.genderOpen;
  }

  openCalendar() {
    if (this.calendarOpen) return;
    this.shownYear = 1990;
    this.shownMonth = 1;
    this.yearListOpen = false;
    this.monthListOpen = false;
    this.calendarOpen = true;
  }

  // A day of the shown month: written as LVGL's "%02d.%02d.%d", and the
  // calendar closes.
  pickDay(day: number) {
    this.birthday = `${String(day).padStart(2, "0")}.${String(this.shownMonth).padStart(2, "0")}.${this.shownYear}`;
    this.calendarOpen = false;
    this.yearListOpen = false;
    this.monthListOpen = false;
  }

  toggleYearList() {
    this.monthListOpen = false;
    this.yearListOpen = !this.yearListOpen;
    if (this.yearListOpen) scrollListTo(2023 - this.shownYear);
  }

  toggleMonthList() {
    this.yearListOpen = false;
    this.monthListOpen = !this.monthListOpen;
    if (this.monthListOpen) scrollListTo(this.shownMonth - 1);
  }

  showYear(year: number) {
    this.shownYear = year;
    this.yearListOpen = false;
  }

  showMonth(month: number) {
    this.shownMonth = month;
    this.monthListOpen = false;
  }

  slideTo(x: number) {
    const ratio = (x - SLIDER_LEFT) / SLIDER_WIDTH;
    this.experience = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  }

  slideStart(x: number) {
    this.sliding = true;
    this.slideTo(x);
  }

  slideMove(x: number) {
    if (this.sliding) this.slideTo(x);
  }

  slideEnd() {
    this.sliding = false;
  }

  toggleHardWorking() {
    this.hardWorking = !this.hardWorking;
  }

  pressLogOut(down: boolean) {
    this.logOutPressed = down;
  }

  toggleTeamPlayer() {
    this.teamPlayer = !this.teamPlayer;
  }
}

export const profile = new ProfileStore();
