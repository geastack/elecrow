import { PRIMARY_CHOICES } from "../lib/palette";
import { theme } from "../stores/theme";

// The tint button in the corner over a white pill that widens across the
// screen to show the swatches, as LVGL's colour changer does. Picking a
// swatch recolours the demo and leaves the strip open; the button closes it.
export function ColorChanger() {
  return (
    <div class="color-changer">
      <div class="color-pill" style={{ width: theme.paletteOpen ? 784 : 49 }}>
        {PRIMARY_CHOICES.map((color, index) => (
          <div
            class="swatch"
            style={{ backgroundColor: color, opacity: theme.paletteOpen ? 1 : 0 }}
            onClick={() => theme.choosePrimary(index)}
          />
        ))}
      </div>
      <div
        class="tint-button"
        style={{ backgroundColor: theme.paletteOpen ? "#ffffff" : theme.primary }}
        onClick={() => theme.togglePalette()}
      >
        <svg width={11} height={16} viewBox="0 0 11 16">
          <path d="M5.5 0 C4 2.6 0 6.8 0 10.5 A5.5 5.5 0 0 0 11 10.5 C11 6.8 7 2.6 5.5 0 Z" fill={theme.paletteOpen ? theme.primary : "#ffffff"} />
          <path d="M2.6 10 A3 3 0 0 0 5 13.2" fill="none" stroke-width={1.4} stroke={theme.paletteOpen ? "#ffffff" : theme.primary} />
        </svg>
      </div>
    </div>
  );
}
