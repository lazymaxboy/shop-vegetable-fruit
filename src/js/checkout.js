import $ from "jquery";
import _ from "lodash";
import { products } from "./db";

const cart = JSON.parse(localStorage.getItem("carts")) || [];

$(function () {
  const items = _.map(_.cloneDeep(cart), (item) => {
    item.product = _.find(products, { id: item.product });

    return item;
  });

  $(".checkout-item").prepend(
    _.map(items, (i) => {
      const itemTemplate = $("#checkout-item").html();
      const item = _.template(itemTemplate);
      const dom = $(item(i));
      return dom;
    })
  );
});