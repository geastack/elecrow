// LVGL composes its theme states by mixing colours: a checked tab or a
// slider track is the primary colour at 20% over white, a disabled widget
// is mixed half-way to grey-lighten-2, a pressed one darkened by 35/255.

function channels(hex: string): number[] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

function toHex(rgb: number[]): string {
  const value = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  return `#${value.toString(16).padStart(6, "0")}`;
}

// `amount` of the way from `hex` to `toward` (both "#rrggbb").
export function mix(hex: string, toward: string, amount: number): string {
  const from = channels(hex);
  const to = channels(toward);
  return toHex(from.map((c: number, i: number) => Math.round(c + (to[i] - c) * amount)));
}

// The colour at `opacity` drawn over white.
export function overWhite(hex: string, opacity: number): string {
  return mix("#ffffff", hex, opacity);
}

export function disabled(hex: string): string {
  return mix(hex, "#e0e0e0", 0.5);
}

export function pressed(hex: string): string {
  return mix(hex, "#000000", 35 / 255);
}
