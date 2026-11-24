import { overWhite } from "../lib/color";
import { TEXT } from "../lib/palette";
import { TAB_ANALYTICS, TAB_PROFILE, TAB_SHOP, theme } from "../stores/theme";

// The store reads stay inside the style so the native build patches the
// colours in place when the tab or the primary colour changes.
function Tab(props: { tab: number; label: string }) {
  return (
    <div
      class="tab"
      style={{
        color: theme.tab === props.tab ? theme.primary : TEXT,
        backgroundColor: theme.tab === props.tab ? overWhite(theme.primary, 0.2) : "#ffffff",
        borderColor: theme.tab === props.tab ? theme.primary : "#ffffff",
      }}
      onClick={() => theme.selectTab(props.tab)}
    >
      <span>{props.label}</span>
    </div>
  );
}

// The Gea logo and demo title on the left, the three tabs on the right.
export function TabBar() {
  return (
    <div class="tab-bar">
      <div class="brand">
        <img class="brand-logo" src="images/gea-logo.png" />
        <div class="brand-text">
          <span class="card-title">Gea</span>
          <span class="muted">Widgets demo</span>
        </div>
      </div>
      <div class="tabs">
        <Tab tab={TAB_PROFILE} label="Profile" />
        <Tab tab={TAB_ANALYTICS} label="Analytics" />
        <Tab tab={TAB_SHOP} label="Shop" />
      </div>
    </div>
  );
}
