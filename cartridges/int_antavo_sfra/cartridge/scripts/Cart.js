/**
 * @module int_antavo_sfra/scripts
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
        var item = items[i];
        var price = ProductHelper.getProductPrice(item);
        result.total += price * item.quantity;
        result.items.push({
            product_id: item.id,
            product_name: item.productName,
            product_url: ProductHelper.getProductUrl(item.id),
            quantity: item.quantity,
            subtotal: price * item.quantity,
        });
    }
    
    return result;
}

exports.createMockedTransactionFor = createMockedTransactionFor;
