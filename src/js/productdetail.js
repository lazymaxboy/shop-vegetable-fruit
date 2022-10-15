import $ from "jquery";
import _ from "lodash";

import { products } from "./db";

const url = new URL(location.href);
const id = Number(url.searchParams.get("id"));
const product = _.find(products, { id });
const cart = JSON.parse(localStorage.getItem("carts")) || [];
const item = _.find(cart, { product: product.id });

// add to cart
const addToCart = (event) => {
  event.preventDefault();

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      product: event.data.id,
      quantity: 1,
    });
  }

  localStorage.setItem("carts", JSON.stringify(cart));
};

// render product detail
$(function () {
  $(".non").html(
    `
            <div class="img-pr-detail">
                <div class="d-flex flex-column gap-3 align-items-center justify-content-center">
                  <div class="img-pr-top"><img src="${product.img}" alt="dsd"></div>
                  <div class="img-pr-bottom d-flex gap-3 align-items-center justify-content-center">
                      <img src="img/pr-detail-1.png" alt="dsd">
                      <img src="img/pr-detail-2.png" alt="dsd">
                      <img src="img/pr-detail-3.png" alt="dsd">
                  </div>
             </div>
            </div>

            <div class="content-pr-detail">
              <div class="tittle-pr-detail">
                <div><p class="font-mali fs-40 fw-500">${product.name}</p></div>
                <div class="d-flex gap-3">
                  <div><span class="font-mali fs-20">$ ${product.price}</span></div>
                  <div
                    class="list-star d-flex justify-content-center align-items-center gap-2"
                  >
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-half"></i>
                  </div>
                </div>
                <div>
                  <br />
                  <p>
                    Avocados have a round shape, but most of them look like a
                    gourd, when ripe, some remain the same color as when they
                    are still green, but some change to black purple, the inside
                    is soft, yellow pale or light green, with a sweet, fatty
                    taste.
                  </p>
                </div>
              </div>
              <div class="content-pr-detail">
                <div class="properties-pr-detail">
                  <div>
                    <p>Unit: <span class="text-gray-fo">1 kg</span></p>
                  </div>
                  <div>
                    <p>Category: <span class="text-gray-fo">Fruit</span></p>
                  </div>
                  <div>
                    <p>SKU: <span class="text-gray-fo">fr001</span></p>
                  </div>
                </div>
                <div
                  class="quality-pr-detail d-flex align-items-center justify-content-between"
                >
                  <div class="qty-cart">
                    <input
                      class="number-qty"
                      type="number"
                      id="input"
                      readonly
                      value="1"                     
                    />
                    <div
                      class="num-in d-flex flex-column gap-2 align-items-center justify-content-center"
                    >
                      <button class="plus" >
                        <i class="fas fa-plus"></i>
                      </button>
                      <button class="minus">
                        <i class="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>

                  <div class="add-cart-pr-detail">
                    <div id="checkout" class="btn-add button button-2">Add to cart</div>
                  </div>
                </div>
              </div>
            </div>
    `
  );

  $(".non").find(".btn-add").on("click", addToCart);
});

//
if (window.document.location.pathname == "/productdetail.html") {
  /////////////////// product +/-
  var input = $(".non").find(".number-qty"),
    minValue = parseInt(input.attr("min")),
    maxValue = parseInt(input.attr("max"));

  let plus = $(".non").find(".plus");

  plus.on("click", function () {
    var inputValue = input.val();
    if (inputValue < maxValue) {
      input.val(parseInt(inputValue) + 1);
    }
  });

  let minus = $(".non").find(".minus");

  minus.on("click", function () {
    var inputValue = input.val();
    if (inputValue < maxValue) {
      input.val(parseInt(inputValue) - 1);
    }
  });

  // product +/-
}