import "../styles/splash.css";

// The boot splash: the CrowPanel logo drops from the top edge to the middle
// of the screen over one second, above the product caption.
export function BootScreen() {
  return (
    <div class="splash">
      <img class="boot-logo" src="images/crowpanel-logo.png" />
      <img class="boot-caption" src="images/splash-caption.png" />
    </div>
  );
}
