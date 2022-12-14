import $ from "jquery";
import _ from "lodash";
import { products } from "./db";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const PRODUCTS_PER_PAGE = 9;

const categories = [];

// add to cart
function addToCart(event) {
  const users = JSON.parse(localStorage.getItem("users"));
  const userLogin = _.find(users, { login: true });
  if (userLogin) {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem("carts")) || [];

    const item = _.find(cart, { product: event.data.id });

    const action = _.find(products, { id: event.data.id });

    let total = action.price;

    if (item) {
      toastr["warning"]("! Sản phẩm đã có giỏ hàng");
      // alert("! Sản phẩm đã có giỏ hàng");
    } else {
      toastr["success"]("Sản phẩm đã được thêm vào giỏ hàng trong giỏ hàng");
      // alert("Sản phẩm đã được thêm vào giỏ hàng trong giỏ hàng");
      cart.push({
        product: event.data.id,
        quantity: 1,
        total: total,
      });
    }

    localStorage.setItem("carts", JSON.stringify(cart));

    $(".number").text(cart.length);
  } else {
    toastr["warning"]("You need to login to perform this function");
    // alert("You need to login to perform this function");
    $(".modal").css("display", "block");
  }
}

// pagination
const pagination = (current, totalPage, prev, next) => {
  const prevButton = $(`<li class="page-item">
                              <a class="page-link"><i class="bi bi-arrow-left"></i></a>
                          </li>`);
  if (prev === 0) {
    prevButton.addClass("disabled");
  } else {
    prevButton.find("a.page-link").attr("href", "?page=" + prev);
  }

  const nextButton = $(`<li class="page-item">
                              <a class="page-link"><i class="bi bi-arrow-right"></i></a>
                          </li>`);

  if (next > totalPage) {
    nextButton.addClass("disabled");
  } else {
    nextButton.find("a.page-link").attr("href", "?page=" + next);
  }

  const pages = [];

  for (let i = 1; i <= totalPage; i++) {
    const btn = $(`<li class="page-item">
                          <a class="page-link">${i}</a>
                      </li>`);

    if (i == current) {
      btn.addClass("disabled");
    } else {
      btn.find("a.page-link").attr("href", "?page=" + i);
    }

    pages.push(btn);
  }

  $(".pagination").html("");
  $(".pagination").append(prevButton, pages, nextButton);
};

// filter by checkbox
const filter = (event) => {
  // filter by check box
  categories.length = 0;

  $("input:checked").each(function () {
    categories.push(this.value);
    render(products);
  });

  // filter by select
  sort();

  // filter by number

  filterRange();
};

// render
const render = () => {
  const $listFruit = $(".list-fruit-product");
  const productTemplate = $("#product-pr").html();
  const product = _.template(productTemplate); // compile

  const filteredProducts = products.filter(
    (p) => categories.length === 0 || categories.includes(p.category)
  );

  const url = new URL(location.href);
  const totalPage = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const current = url.searchParams.get("page") || 1;
  const prev = current - 1;
  const next = +current + 1;

  $listFruit.html("");
  $listFruit.append(
    _.map(
      filteredProducts.slice(
        (current - 1) * PRODUCTS_PER_PAGE,
        current * PRODUCTS_PER_PAGE
      ),
      (pr) => {
        const dom = $(product(pr));

        dom.find(".btn-add").on("click", pr, addToCart);

        return dom;
      }
    )
  );

  pagination(current, totalPage, prev, next);
};

$(function () {
  render();

  $(".list-category").append(
    _.uniq(products.map(({ category }) => category)).map((c) => {
      const categoryTemplate = $("#category-template").html();
      const template = _.template(categoryTemplate);

      const dom = $(template({ category: c }));
      return dom;
    })
  );

  // sort
  $(".sort-price").on("change", filter);

  // filter by checkbox
  $("form.title-category").on("change", filter);

  // filter number
  $(".price-wrap").find(".price-title").on("click", filter);

  // search
  search();
});

// render name by input
const renderName = function (event) {
  const productTemplate = $("#search-name").html();
  const productList = _.template(productTemplate);
  $(".text-to-search").append(
    _.map(event, (pr) => {
      const dom = $(productList(pr));

      return dom;
    })
  );
};

// search function
const search = () => {
  $("input.search-box-pr").on("keyup", () => {
    let value = $("input.search-box-pr").val().toString().toUpperCase();
    let obj = {};
    const productName = products.filter((pr) => {
      if (pr.name.toUpperCase().indexOf(value) == -1) {
        $(".text-to-search").html("");
      } else return pr.name.toUpperCase().indexOf(value) > -1;
    });

    if (value == "") {
      $(".text-to-search").html("");
    } else renderName(productName);

    $(".text-to-search")
      .find("li")
      .each(function () {
        var text = $(this).text();
        if (obj[text]) {
          $(this).remove();
        } else {
          obj[text] = true;
        }
      });
  });
};

// clear content search
$(window).on("click", (e) => {
  if (
    $(e.target).is(".section-shop") ||
    $(e.target).is(".section-filter") ||
    $(e.target).is(".filter-content")
  ) {
    $(".text-to-search").html("");
    $("input.search-box-pr").val("");
  }
});

// sort function
let productCopy = [];
Array.prototype.push.apply(productCopy, products);

const sort = () => {
  let value = $(".sort-price option:selected").text();
  if (value == "Price ascending") {
    render(products.sort((a, b) => a.price - b.price));
  } else if (value == "Price descending") {
    render(products.sort((a, b) => b.price - a.price));
  } else if (value == "Name ascending") {
    render(
      products.sort((a, b) =>
        a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0
      )
    );
  } else if (value == "Name descending") {
    render(
      products.sort((a, b) =>
        a.name !== b.name ? (a.name > b.name ? -1 : 1) : 0
      )
    );
  } else {
    products.length = [];
    Array.prototype.push.apply(products, productCopy);
    render();
  }
};

// filter number

const filterRange = () => {
  const lower = $(".price-wrap").find("input#one").val();
  const upper = $(".price-wrap").find("input#two").val();
  const productFilterRange = products.filter((pr) => {
    return pr.price >= Number(lower) && pr.price <= Number(upper);
  });
  // product[] = product filter
  products.length = [];
  Array.prototype.push.apply(products, productFilterRange);
  // render product after filter
  render();

  // after filter return product default
  products.length = [];
  Array.prototype.push.apply(products, productCopy);
};
