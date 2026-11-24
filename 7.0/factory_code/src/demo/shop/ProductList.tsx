import { type Product, shop } from "../../stores/shop";

// One row of the demo's shop item grid: the picture over both rows, a
// 5 px spacer, then the name over the category and the price on the right.
function ProductRow(props: { product: Product }) {
  return (
    <div class="product">
      <img class="product-image" src="images/lvgl-clothes.png" />
      <span class="product-name">{props.product.name}</span>
      <span class="muted product-category">{props.product.category}</span>
      <span class="product-price">{props.product.price}</span>
    </div>
  );
}

// Taller than the 300 px card, so it scrolls, as on the LVGL demo.
export function ProductList() {
  return (
    <div class="card card-half list-card product-list">
      <span class="card-title">Top products</span>
      {shop.products.map((product) => (
        <ProductRow product={product} />
      ))}
    </div>
  );
}
