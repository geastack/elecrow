import { Store } from "@geastack/core";

export type Product = { name: string; category: string; price: string };
export type Notice = { text: string; checked: boolean; disabled: boolean };

// The Shop tab's lists, with the checked and disabled states the LVGL demo
// starts its notification checkboxes in.
class ShopStore extends Store {
  products: Product[] = [
    { name: "Blue jeans", category: "Clothes", price: "$722" },
    { name: "Blue jeans", category: "Clothes", price: "$411" },
    { name: "Blue jeans", category: "Clothes", price: "$917" },
    { name: "Blue jeans", category: "Clothes", price: "$64" },
    { name: "Blue jeans", category: "Clothes", price: "$805" },
  ];

  notices: Notice[] = [
    { text: "Item purchased", checked: false, disabled: false },
    { text: "New connection", checked: false, disabled: false },
    { text: "New subscriber", checked: true, disabled: false },
    { text: "New message", checked: false, disabled: true },
    { text: "Milestone reached", checked: true, disabled: true },
    { text: "Out of stock", checked: false, disabled: false },
  ];

  toggleNotice(index: number) {
    const notice = this.notices[index];
    if (notice.disabled) return;
    notice.checked = !notice.checked;
  }
}

export const shop = new ShopStore();
