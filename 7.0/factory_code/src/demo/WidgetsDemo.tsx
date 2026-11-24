import { theme } from "../stores/theme";
import { AnalyticsTab } from "./analytics/AnalyticsTab";
import { ColorChanger } from "./ColorChanger";
import { Calendar } from "../components/Calendar";
import { profile } from "../stores/profile";
import { ProfileTab } from "./profile/ProfileTab";
import { ShopTab } from "./shop/ShopTab";
import { TabBar } from "./TabBar";
import "../components/Card.css";
import "./demo.css";

// LVGL 8's widgets demo at 800x480: the tab bar on top, the three tab pages
// side by side in a pager that swipes a page at a time (LVGL's tabview
// content), and the colour changer in the corner.
export function WidgetsDemo() {
  return (
    <div class="widgets fade-in">
      <TabBar />
      <div class="tab-content">
        <div class="tab-pager" snap-page onScroll={() => theme.pagerSettled()}>
          {/* The demo opens on Profile; the other pages mount once, just
              after it shows. Nothing here reads the open tab, so changing
              tabs never remounts a page (or loses its scroll). */}
          <ProfileTab />
          {theme.allPages ? <AnalyticsTab /> : <div class="tab-page-slot" />}
          {theme.allPages ? <ShopTab /> : <div class="tab-page-slot" />}
        </div>
      </div>
      <ColorChanger />
      {profile.calendarOpen ? <Calendar /> : null}
    </div>
  );
}
