import $ from "jquery";
import _, { sum } from "lodash";
import { products } from "./db";

let cart = JSON.parse(localStorage.getItem("carts")) || [];

const deleteItem = (event) => {
  if (confirm("Chắc chắn xóa không?")) {
    cart = _.filter(cart, (item) => item.product !== event.data.product.id);

    localStorage.setItem("carts", JSON.stringify(cart));

    event.target.closest(".product-in-cart").remove();
  }
};

const increment = (event) => {
  const product = _.find(cart, { product: event.data.product.id });
  const action = _.find(products, { id: event.data.product.id });
  console.log(action);
  product.quantity += 1;
  const item = $(event.target.closest(".product-in-cart"));
  item.find(".number-qty").val(product.quantity);
  product.total = Number(action.price * product.quantity);

  item.find(".total").text(product.total);
  localStorage.setItem("carts", JSON.stringify(cart));
};

const decrement = (event) => {
  const product = _.find(cart, { product: event.data.product.id });
  const action = _.find(products, { id: event.data.product.id });
  if (product.quantity === 1) return;
  else product.quantity -= 1;
  const item = $(event.target.closest(".product-in-cart"));
  item.find(".number-qty").val(product.quantity);
  product.total = Number(action.price * product.quantity);
  item.find(".total").text(product.total);
  localStorage.setItem("carts", JSON.stringify(cart));
  // $(".total" + product.id).text(product.quantity);
};

$(function () {
  const items = _.map(_.cloneDeep(cart), (item) => {
    item.product = _.find(products, { id: item.product });

    return item;
  });

  $(".content-cart").prepend(
    _.map(items, (i) => {
      const itemTemplate = $("#item-cart").html();
      const item = _.template(itemTemplate);
      const dom = $(item(i));
      dom.find(".trash").on("click", i, deleteItem);
      dom.find(".btn-up").on("click", i, increment);
      dom.find(".btn-down").on("click", i, decrement);
      return dom;
    })
  );
});

$(".btn-coupon").on("click", function () {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += Number(cart[i].total);
  }

  $(".sum").text(sum);
});
