// Colours of LVGL 8's default light theme, which the factory firmware runs
// the widgets demo in. Values are the Material palette LVGL ships.

export const SCREEN_BG = "#f5f5f5";
export const CARD_BG = "#ffffff";
export const BORDER = "#e0e0e0";
export const TEXT = "#212121";
export const TEXT_MUTED = "#c8c8c8";
// LVGL draws a text area's placeholder lighter than its text.
export const PLACEHOLDER = "#bdbdbd";
export const GREY_LIGHT = "#e0e0e0";
export const GREY = "#9e9e9e";
export const GREY_LIGHTEN_1 = "#bdbdbd";
export const GREY_DARKEN_1 = "#757575";
export const GREY_DARKEN_4 = "#212121";

export const RED = "#f44336";
export const BLUE = "#2196f3";
export const GREEN = "#4caf50";
// lv_palette_darken(..., 3): Material's 800 shades.
export const RED_DARK = "#c62828";
export const BLUE_DARK = "#1565c0";
export const GREEN_DARK = "#2e7d32";

// The colour changer's swatches, in LVGL's order: blue, green, blue grey,
// orange, red, purple and teal (each palette's main shade).
export const PRIMARY_CHOICES: string[] = ["#2196f3", "#4caf50", "#607d8b", "#ff9800", "#f44336", "#9c27b0", "#009688"];

// The splash screens are Elecrow's own artwork on black.
export const SPLASH_BG = "#000000";
export const SPLASH_ACCENT = "#09befb";
export const TOUCH_LABEL = "#ff0000";
export const TOUCH_VALUE = "#00ff00";
