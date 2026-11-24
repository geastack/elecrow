import { NotificationList } from "./NotificationList";
import { ProductList } from "./ProductList";
import { SummaryCard } from "./SummaryCard";
import "./shop.css";

// Shop: the weekly summary with its bar chart, then the top products and
// the notification settings side by side.
export function ShopTab() {
  return (
    <div class="tab-page" momentum>
      <SummaryCard />
      <div class="card-row">
        <ProductList />
        <NotificationList />
      </div>
    </div>
  );
}
