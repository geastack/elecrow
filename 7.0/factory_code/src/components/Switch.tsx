import "./controls.css";

// LVGL's switch: a grey-lighten-2 track that turns primary when on, with a
// white knob inset 3 px.
export function Switch(props: { on: boolean; color: string; onToggle: () => void }) {
  return (
    <div
      class={props.on ? "switch switch-on" : "switch"}
      style={{ backgroundColor: props.on ? props.color : "#e0e0e0" }}
      onClick={() => props.onToggle()}
    >
      <div class="switch-knob" />
    </div>
  );
}
