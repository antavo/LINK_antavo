/**
 * @module scripts/Cart
 */

"use strict"

var ProductHelper = require("~/cartridge/scripts/Product");
var URLUtils = require("dw/web/URLUtils");

/**
 * @param {Object} cart
 * @returns {Object}
 */
function createMockedTransactionFor(items) {
    var result = {
        total: 0,
        transaction_id: "fake_transaction",
        items: [],
    };
    
    for (var i in items) {
        var item = items[i].object;
        var price = ProductHelper.getProductPrice(item.product);
        result.total += price * item.quantity.getValue();
        result.items.push({
            product_id: item.product.ID,
            product_name: item.product.name,
            product_url: URLUtils.https("Product-Show", "pid", item.product.ID).toString(),
            quantity: item.quantity.getValue(),
            subtotal: price * item.quantity.getValue(),
            sku: item.product.manufacturerSKU || "",
        });
    }
    
    return result;
}

exports.createMockedTransactionFor = createMockedTransactionFor;
