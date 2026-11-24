import { GREY, TEXT } from "../lib/palette";
import { CALENDAR_MONTHS, CALENDAR_YEARS, profile } from "../stores/profile";
import { theme } from "../stores/theme";
import "./calendar.css";

const DAY_NAMES: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// lv_btnmatrix's cell edges for `count` cells over `extent` px with `gap`
// between them: cell i spans [(free * i) / count + i * gap,
// (free * (i + 1)) / count + i * gap - 1], free = extent - gaps.
function cellStart(i: number, count: number, extent: number, gap: number): number {
  return Math.floor(((extent - gap * (count - 1)) * i) / count) + i * gap;
}

function cellSize(i: number, count: number, extent: number, gap: number): number {
  return cellStart(i + 1, count, extent, gap) - gap - cellStart(i, count, extent, gap);
}

function daysIn(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

interface DayCell {
  label: string;
  day: number; // 0 for a day name or a day of another month
  x: number;
  y: number;
  w: number;
  h: number;
}

// The 7 x 7 matrix LVGL lays out: the day names, then six weeks from the
// Sunday on or before the 1st. Days of the neighbouring months are disabled.
function dayCells(year: number, month: number): DayCell[] {
  const cells: DayCell[] = [];
  const first = new Date(year, month - 1, 1).getDay();
  const length = daysIn(year, month);
  const previousLength = month === 1 ? 31 : daysIn(year, month - 1);
  for (let index = 0; index < 49; index++) {
    const row = Math.floor(index / 7);
    const col = index % 7;
    let label = "";
    let day = 0;
    if (row === 0) {
      label = DAY_NAMES[col];
    } else {
      const slot = index - 7 - first;
      if (slot < 0) label = String(previousLength + slot + 1);
      else if (slot >= length) label = String(slot - length + 1);
      else {
        day = slot + 1;
        label = String(day);
      }
    }
    cells.push({
      label,
      day,
      x: cellStart(col, 7, 274, 5),
      y: cellStart(row, 7, 242, 5),
      w: cellSize(col, 7, 274, 5),
      h: cellSize(row, 7, 242, 5),
    });
  }
  return cells;
}

function HeaderDropdown(props: {
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onChange: (index: number) => void;
}) {
  return (
    <div class="calendar-dropdown-field">
      <div class="dropdown calendar-dropdown" onClick={() => props.onToggle()}>
        <span>{props.value}</span>
        <svg class="dropdown-chevron" width={14} height={9} viewBox="0 0 14 9">
          <polyline points="1.5,1.5 7,7 12.5,1.5" fill="none" stroke="#212121" stroke-width={3} />
        </svg>
      </div>
      {props.open ? (
        <div class="calendar-dropdown-list">
          {props.options.map((option, index) => (
            <div
              class="dropdown-option"
              style={{
                backgroundColor: option === props.value ? theme.primary : "#ffffff",
                color: option === props.value ? "#ffffff" : TEXT,
              }}
              onClick={() => props.onChange(index)}
            >
              {option}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// lv_calendar with lv_calendar_header_dropdown, 300 x 330 and 30 px below the
// centre of a half-grey layer over the whole demo. The layer swallows taps;
// only picking a day closes it, as in the LVGL demo.
export function Calendar() {
  return (
    <div class="calendar-layer">
      <div class="calendar-dim" />
      <div class="calendar">
        <div class="calendar-header">
          <HeaderDropdown
            value={String(profile.shownYear)}
            options={CALENDAR_YEARS}
            open={profile.yearListOpen}
            onToggle={() => profile.toggleYearList()}
            onChange={(index: number) => profile.showYear(2023 - index)}
          />
          <HeaderDropdown
            value={CALENDAR_MONTHS[profile.shownMonth - 1]}
            options={CALENDAR_MONTHS}
            open={profile.monthListOpen}
            onToggle={() => profile.toggleMonthList()}
            onChange={(index: number) => profile.showMonth(index + 1)}
          />
        </div>
        <div class="calendar-days">
          {dayCells(profile.shownYear, profile.shownMonth).map((cell, index) => (
            <div
              class={index >= 7 && cell.day > 0 ? "calendar-day calendar-day-active" : "calendar-day"}
              style={{
                left: cell.x + 11,
                top: cell.y + 11,
                width: cell.w,
                height: cell.h,
                color: index >= 7 && cell.day === 0 ? GREY : TEXT,
              }}
              onClick={() => {
                if (cell.day > 0) profile.pickDay(cell.day);
              }}
            >
              {cell.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
