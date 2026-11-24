import { ReactiveComponent } from "@geastack/core";
import "./styles/app.css";
import { BootScreen } from "./screens/boot";
import { CalibrateScreen } from "./screens/calibrate";
import { MenuScreen } from "./screens/menu";
import { TouchScreen } from "./screens/touch";
import { SCREEN_BOOT, SCREEN_CALIBRATE, SCREEN_MENU, SCREEN_TOUCH, SCREEN_WIDGETS, flow } from "./stores/flow";
import { WidgetsDemo } from "./demo/WidgetsDemo";

export class App extends ReactiveComponent {
  template() {
    return (
      <div class="app">
        {flow.screen === SCREEN_BOOT ? <BootScreen /> : null}
        {flow.screen === SCREEN_MENU ? <MenuScreen /> : null}
        {flow.screen === SCREEN_TOUCH ? <TouchScreen /> : null}
        {flow.screen === SCREEN_CALIBRATE ? <CalibrateScreen /> : null}
        {flow.screen === SCREEN_WIDGETS ? <WidgetsDemo /> : null}
      </div>
    );
  }
}
