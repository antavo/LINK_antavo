/**
 * @module int_antavo_sfra/controllers
 */ 

"use strict";

var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var config = require("int_antavo/cartridge/scripts/Config");

/**
 * 
 */
server.get("Data", function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    var currentBasket = BasketMgr.getCurrentBasket();
    var basketModel = new CartModel(currentBasket);
    var helper = require("int_antavo_sfra/cartridge/scripts/Cart");
    res.json({transaction: helper.createMockedTransactionFor(basketModel.items)});
    next();
});

module.exports = server.exports();
