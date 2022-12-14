import $ from "jquery";
import _, { sum } from "lodash";
import { products } from "./db";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

let cart = JSON.parse(localStorage.getItem("carts")) || [];

const deleteItem = (event) => {
  if (
    toastr["warning"](
      'Bạn có chắc muốn xóa ?<br /><br /><button type="button" class="btn clear">Yes</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button type="button" class="btn">No</button>'
    )
  ) {
    $(".toast button.clear").on("click", () => {
      cart = _.filter(cart, (item) => item.product !== event.data.product.id);

      localStorage.setItem("carts", JSON.stringify(cart));

      event.target.closest(".product-in-cart").remove();
      checkProductInCart();
      $(".number").text(cart.length);
      total();
    });
  }
};

const increment = (event) => {
  const product = _.find(cart, { product: event.data.product.id });
  const action = _.find(products, { id: event.data.product.id });
  product.quantity += 1;
  const item = $(event.target.closest(".product-in-cart"));
  item.find(".number-qty").val(product.quantity);
  product.total = (action.price * product.quantity).toFixed(2);

  item.find(".total").text(product.total);
  localStorage.setItem("carts", JSON.stringify(cart));
  total();
};

const decrement = (event) => {
  const product = _.find(cart, { product: event.data.product.id });
  const action = _.find(products, { id: event.data.product.id });
  if (product.quantity === 1) return;
  else product.quantity -= 1;
  const item = $(event.target.closest(".product-in-cart"));
  item.find(".number-qty").val(product.quantity);
  product.total = (action.price * product.quantity).toFixed(2);
  item.find(".total").text(product.total);
  localStorage.setItem("carts", JSON.stringify(cart));
  // $(".total" + product.id).text(product.quantity);
  total();
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

  //
  total();
  checkProductInCart();
});

const checkProductInCart = () => {
  if ($(".content-cart").find(".product-in-cart").length == 0) {
    $(".title-cart").html(`<div class="no-pr">No products in cart</div>`);
  } else {
    $(".title-cart").html();
  }
};

//apply code 10%
$(".btn-coupon").on("click", function () {
  let sum = 0;
  let codeName = $(".coupon-code").val().toString().toUpperCase();
  let code = [
    { id: 1, name: "techmaster" },
    { id: 2, name: "mrtrung" },
    { id: 3, name: "tfruit" },
  ];
  const action = _.filter(code, (pr) => {
    return pr.name.toUpperCase().includes(codeName);
  });
  if (action.length == 1) {
    for (let i = 0; i < cart.length; i++) {
      sum += Number(cart[i].total);
    }
    $(".sum").text((sum * 0.9).toFixed(2));
    toastr["success"]("Bạn được giảm giá 10% với mã này");
  } else {
    toastr["error"]("Mã giảm giá không tồn tại");
  }
});

const total = () => {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += Number(cart[i].total);
  }

  $(".sum").text(sum.toFixed(2));
};

$("button.btn-next-to-checkout").on("click", (event) => {
  const users = JSON.parse(localStorage.getItem("users"));
  const userLogin = _.find(users, { login: true });
  if (userLogin) {
    window.location.pathname = "/checkout.html";
  } else {
    toastr["warning"]("You need to login to perform this function");
    // alert("You need to login to perform this function");
    $(".modal").css("display", "block");
  }
});
