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
server.get("Show", function (req, res, next) {
    res.render("antavo/microsite", {
        micrositeUrl: config.get().getCustom().microsite_url + "?c=" + session.customer.getID(),
        micrositeTemplate: config.get().getCustom().microsite_template,
    });
    next();
});

/**
 * 
 */
server.post("OptIn", function (req, res, next) {
    var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
    eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CUSTOMER_OPT_IN, this, {
        opt_in: true,
        customer: customer,
    });
    
    var redirect = request.httpParameterMap["redirect"];
    
    if (redirect) {
        res.redirect(redirect.stringValue);
    }
    
    next();
});

/**
 * 
 */
server.post("OptOut", function (req, res, next) {
    var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
    eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CUSTOMER_OPT_OUT, this, { customer: customer });
    
    var redirect = request.httpParameterMap["redirect"];
    
    if (redirect) {
        res.redirect(redirect.stringValue);
    }
    
    next();
});

module.exports = server.exports();
