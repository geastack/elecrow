import { Store } from "@geastack/core";
import { PRIMARY_CHOICES } from "../lib/palette";

// The tab pages sit side by side in one horizontal pager, a page each.
const PAGE_WIDTH = 800;

export const TAB_PROFILE = 0;
export const TAB_ANALYTICS = 1;
export const TAB_SHOP = 2;

// The widgets demo's chrome: which tab is open, the theme's primary colour,
// and whether the colour changer's swatches are showing.
class ThemeStore extends Store {
  tab = TAB_PROFILE;
  primary = PRIMARY_CHOICES[0];
  paletteOpen = false;
  // Whether every tab page is mounted, or only Profile, which the demo opens
  // on (its first frames, while the menu's memory is being released).
  allPages = false;

  mountAllPages() {
    this.allPages = true;
  }

  // A tab button: highlight it now and slide the pager to its page, which
  // animates the way LVGL's tabview does (the pager snaps to pages).
  selectTab(tab: number) {
    this.tab = tab;
    this.paletteOpen = false;
    const pager = document.querySelector(".tab-pager");
    if (pager) pager.scrollLeft = tab * PAGE_WIDTH;
  }

  // The pager settled on a page, after a swipe or a tab button's slide:
  // that page's tab is the open one.
  pagerSettled() {
    const pager = document.querySelector(".tab-pager");
    if (!pager) return;
    const left = pager.scrollLeft ?? 0;
    const tab = Math.round(left / PAGE_WIDTH);
    if (tab !== this.tab) {
      this.tab = tab;
      this.paletteOpen = false;
    }
  }

  togglePalette() {
    this.paletteOpen = !this.paletteOpen;
  }

  choosePrimary(index: number) {
    this.primary = PRIMARY_CHOICES[index];
  }
}

export const theme = new ThemeStore();
