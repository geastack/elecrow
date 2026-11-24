import { overWhite } from "../../lib/color";
import { profile, SLIDER_WIDTH } from "../../stores/profile";
import { theme } from "../../stores/theme";
import "../../components/controls.css";

function filled(value: number): number {
  return Math.round((SLIDER_WIDTH * value) / 100);
}

// LVGL's slider: an 8 px track in the primary colour at 20%, the filled
// part in full primary, and a 20 px primary knob; while held, the value
// shows above the knob. The slider owns its drag (touch-action none):
// the tab's scroller must not take a drag that starts on it. It reads the profile store itself so dragging
// patches the widths and positions in place rather than rebuilding it.
export function ExperienceSlider() {
  return (
    <div
      class="slider"
      touch-action="none"
      onPointerDown={(event) => {
        event.preventDefault();
        profile.slideStart(event.clientX);
      }}
      onPointerMove={(event) => {
        event.preventDefault();
        profile.slideMove(event.clientX);
      }}
      onPointerUp={() => profile.slideEnd()}
      onPointerCancel={() => profile.slideEnd()}
    >
      <div class="slider-track" style={{ backgroundColor: overWhite(theme.primary, 0.2) }} />
      <div class="slider-indicator" style={{ width: filled(profile.experience), backgroundColor: theme.primary }} />
      <div class="slider-knob" style={{ left: filled(profile.experience), backgroundColor: theme.primary }} />
      {profile.sliding ? (
        <div class="slider-value" style={{ left: filled(profile.experience) - 10 }}>
          <span>{`${profile.experience}`}</span>
        </div>
      ) : null}
    </div>
  );
}
