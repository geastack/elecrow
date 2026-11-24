import { ReactiveComponent } from "@geastack/core";
import type { GeaElement } from "@geastack/core";
import { disabled, pressed } from "../lib/color";
import "./controls.css";

interface CheckboxProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  color: string;
  onToggle: () => void;
}

// LVGL's checkbox: a 22 px box (the 18 px line plus 2 px padding) with a
// 2 px primary border, filled primary with LVGL's bold white tick when checked, and
// its label 8 px to the right. Disabled mixes the box half-way to grey.
//
// Pressed, LVGL runs the box through its 35/255 dark filter (fill, border
// and tick alike) and grows it lv_disp_dpx(3) = 2 px a side without moving
// the label.
//
// A click toggles it (LV_OBJ_FLAG_CHECKABLE); the owner holds the state and
// hands it back through `checked`.
export class Checkbox extends ReactiveComponent<GeaElement, CheckboxProps> {
  pressed = false;

  toggle(props: CheckboxProps) {
    if (props.disabled) return;
    props.onToggle();
  }

  press(props: CheckboxProps, down: boolean) {
    if (props.disabled) return;
    this.pressed = down;
  }

  // A colour as the indicator draws it in the current state.
  shade(props: CheckboxProps, hex: string): string {
    if (props.disabled) return disabled(hex);
    return this.pressed ? pressed(hex) : hex;
  }

  template(props: CheckboxProps) {
    return (
      <div
        class="checkbox"
        onClick={() => this.toggle(props)}
        onPointerDown={() => this.press(props, true)}
        onPointerUp={() => this.press(props, false)}
      >
        <div
          class={this.pressed ? "checkbox-box checkbox-box-pressed" : "checkbox-box"}
          style={{
            backgroundColor: this.shade(props, props.checked ? props.color : "#ffffff"),
            borderColor: this.shade(props, props.color),
          }}
        >
          {props.checked ? (
            <svg width={18} height={18} viewBox="0 0 18 18">
              <polyline points="2,8 8.5,13 16,4.5" fill="none" stroke={this.pressed ? pressed("#ffffff") : "#ffffff"} stroke-width={3.2} />
            </svg>
          ) : null}
        </div>
        <span class="checkbox-label">{props.label}</span>
      </div>
    );
  }
}
