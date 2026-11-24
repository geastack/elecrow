import "./controls.css";

// A 13 px coloured bullet and its line, under a meter. LVGL puts the bullet
// in a content-sized grid column 11 px left of the text, top-aligned.
export function Legend(props: { color: string; text: string }) {
  return (
    <div class="legend">
      <div class="bullet" style={{ backgroundColor: props.color }} />
      <span class="legend-text">{props.text}</span>
    </div>
  );
}
