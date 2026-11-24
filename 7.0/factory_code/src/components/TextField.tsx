import { PLACEHOLDER, TEXT } from "../lib/palette";
import "./controls.css";

// A labelled one-line text input. The engine draws a placeholder in the
// input's own colour, so an empty field takes LVGL's placeholder grey.
export function TextField(props: {
  label: string;
  value: string;
  placeholder: string;
  password: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div class="field">
      <span class="muted">{props.label}</span>
      <input
        class="text-input"
        type={props.password ? "password" : "text"}
        value={props.value}
        style={{ color: props.value ? TEXT : PLACEHOLDER }}
        placeholder={props.placeholder}
        onInput={(event) => props.onChange(event.target.value)}
      />
    </div>
  );
}
