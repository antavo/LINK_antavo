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
server.get("Include", function (req, res, next) {
    res.render("antavo/includes/js-sdk", {
        sdkUrl: config.getSdkUrl(),
        apiKey: config.getApiKey(),
        config: config.getConfiguration(),
        customerId: session.customer.getID(),
    });
    next();
});

module.exports = server.exports();
