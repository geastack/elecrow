import { disabled, pressed } from "../lib/color";
import "./controls.css";

// LVGL's default-theme button: primary background, white label, greyed by
// mixing when disabled and darkened when pressed.
function background(props: { color: string; disabled: boolean; pressed: boolean }): string {
  if (props.disabled) return disabled(props.color);
  if (props.pressed) return pressed(props.color);
  return props.color;
}

export function Button(props: { label: string; color: string; disabled: boolean; pressed: boolean; onPress: (down: boolean) => void }) {
  return (
    <div class="button-frame">
      <div class={props.disabled ? "button-shadow button-shadow-disabled" : "button-shadow"} />
      <div
        class="button"
        style={{ backgroundColor: background(props) }}
        onPointerDown={() => (props.disabled ? null : props.onPress(true))}
        onPointerUp={() => (props.disabled ? null : props.onPress(false))}
      >
        <span class="button-label" style={{ color: props.disabled ? "#f0f0f0" : "#ffffff" }}>
          {props.label}
        </span>
      </div>
    </div>
  );
}
