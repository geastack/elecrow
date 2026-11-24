// The LVGL demo fills its charts with lv_rand(); a fixed-seed generator
// gives the same bars on every boot.
let seed = 0x2f6b1d37;

function rand(min: number, max: number): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return min + (seed % (max - min + 1));
}

function series(count: number, min: number, max: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < count; i++) values.push(rand(min, max));
  return values;
}

export const MONTHS: string[] = ["Jan", "Febr", "March", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export const DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const VISITORS = series(12, 10, 80);
export const REVENUE_LAST_YEAR = series(12, 10, 80);
export const REVENUE_THIS_YEAR = series(12, 10, 80);
export const WEEK_SALES = series(7, 60, 90);
