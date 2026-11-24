import { flow } from "../stores/flow";
import "./CountdownBar.css";

const WIDTH = 480;

function fillWidth(percent: number): number {
  return Math.round((WIDTH * percent) / 100);
}

// Elecrow's progress bar: the track artwork, the fill artwork cropped to the
// countdown, and a caption on top. It reads the flow store itself: a value
// passed in through props would rebuild the whole bar on every tick, while
// a store read in a style or text binding patches just that one property.
export function CountdownBar() {
  return (
    <div class="countdown">
      <img class="countdown-track" src="images/bar-track.png" />
      <div class="countdown-fill" style={{ width: fillWidth(flow.countdown) }}>
        <img class="countdown-fill-image" src="images/bar-fill.png" />
      </div>
      <span class="countdown-text">{flow.barText}</span>
    </div>
  );
}
