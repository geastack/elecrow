import "../styles/splash.css";
import { flow } from "../stores/flow";

const CORNER_CLASSES = ["corner corner-tl", "corner corner-bl", "corner corner-tr", "corner corner-br"];

// Corner calibration: each corner lights red in turn and waits for a press.
export function CalibrateScreen() {
  return (
    <div class="splash" onPointerDown={(event) => flow.sampleCorner(event.clientX, event.clientY)}>
      <span class="calibrate-title">Touch Adjust</span>
      <div class={flow.cornerArmed ? CORNER_CLASSES[flow.corner] : "corner-hidden"} />
    </div>
  );
}
