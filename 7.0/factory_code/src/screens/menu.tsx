import { CountdownBar } from "../components/CountdownBar";
import { ImageButton } from "../components/ImageButton";
import { flow } from "../stores/flow";
import "../styles/splash.css";

// The CrowPanel menu: the board's spec sheet as a backdrop, the touch-check
// button bottom left, the home button bottom right, and a countdown bar
// that opens the widgets demo when it runs out.
export function MenuScreen() {
  return (
    <div class="splash fade-in">
      <img class="menu-backdrop" src="images/background.png" />
      <ImageButton
        class="round-button menu-touch"
        image="images/icon-touch.png"
        pressedImage="images/icon-touch-pressed.png"
        pressed={flow.touchPressed}
        onPress={(down: boolean) => flow.pressTouch(down)}
      />
      <ImageButton
        class="round-button menu-home"
        image="images/icon-home.png"
        pressedImage="images/icon-home-pressed.png"
        pressed={flow.homePressed}
        onPress={(down: boolean) => flow.pressHome(down)}
      />
      <CountdownBar />
    </div>
  );
}
