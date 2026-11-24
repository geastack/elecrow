import { ImageButton } from "../components/ImageButton";
import { flow } from "../stores/flow";
import "../styles/splash.css";

// The touch check: wherever a finger lands, the panel's coordinates show in
// the middle. The left button runs the corner calibration, the right one
// goes back to the menu.
export function TouchScreen() {
  return (
    <div
      class="splash"
      onPointerDown={(event) => flow.report(event.clientX, event.clientY)}
      onPointerMove={(event) => flow.report(event.clientX, event.clientY)}
    >
      <span class="touch-label">Touch Adjust:</span>
      <span class="touch-value">{`${flow.touchX}  ${flow.touchY}`}</span>
      <ImageButton
        class="round-button touch-adjust"
        image="images/icon-touch.png"
        pressedImage="images/icon-touch-pressed.png"
        pressed={flow.adjustPressed}
        onPress={(down: boolean) => flow.pressAdjust(down)}
      />
      <ImageButton
        class="round-button touch-return"
        image="images/icon-return.png"
        pressedImage="images/icon-return-pressed.png"
        pressed={flow.returnPressed}
        onPress={(down: boolean) => flow.pressReturn(down)}
      />
    </div>
  );
}
