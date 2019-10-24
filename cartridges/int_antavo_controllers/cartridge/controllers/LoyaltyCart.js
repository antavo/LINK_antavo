/**
 * @module int_antavo_controllers/controllers
 */

"use strict"

var Template = require("int_antavo/cartridge/scripts/Template");
var Logger = require("dw/system/Logger");
var Exception = require("int_antavo/cartridge/scripts/Exception");

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
     
        var helper = require("~/cartridge/scripts/Cart");
        var shipments = session.forms.cart.shipments;
        
        for (var i in shipments) {
            var shipment = shipments[i];
            Template.renderJson({
                transaction: helper.createMockedTransactionFor(shipment.items),
            });
            break;
        }
    } catch (e) {
        Template.renderJson({error: e});
    }
}

exports.Include = include;
exports.Include.public = true;
exports.Data = data;
exports.Data.public = true;
