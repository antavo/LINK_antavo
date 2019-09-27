/**
 * 
 */

var Template = require("bm_antavo/cartridge/scripts/utils/template");
var Logger = require("dw/system/Logger");
var Exception = require("~/cartridge/scripts/client/exception");
var URLUtils = require("dw/web/URLUtils");

/**
 * @param {Object} cart
 * @returns {Object}
 */
function createMockedTransactionFor(cart) {
    var result = {
        total: 0,
        transaction_id: "fake_transaction",
        items: [],
    };
    var shipments = cart.shipments;
    
    for (var i in shipments) {
        var items = shipments[i].items;
        
        for (var j in items) {
            var item = items[j].object;
            var price = item.product.getPriceModel().getPrice().getValue();
            result.total += price * item.quantity.getValue();
            result.items.push({
                product_id: item.product.ID,
                product_name: item.product.name,
                product_url: URLUtils.https('Product-Show', 'pid', item.product.ID).toString(),
                quantity: item.quantity.getValue(),
                subtotal: price * item.quantity.getValue(),
                sku: item.product.manufacturerSKU || "",
            });
        }
    }
    
    return result;
}

/**
 *
 */
function include() {
    Template.render("antavo/includes/cart-points");
}

/**
 *
 */
function data() {
    try {
        if (!session.forms || !session.forms.cart) {
            // TODO: proper exception code
            throw Exception.createException(
                "Missing cart object from session",
                0
            );
        }
     
        Template.renderJson(createMockedTransactionFor(session.forms.cart));
    } catch (e) {
        Logger.log(e.message);
        Template.renderJson({});
    }
}

exports.Include = include;
exports.Include.public = true;
exports.Data = data;
exports.Data.public = true;
