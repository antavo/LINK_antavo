/**
 * Default Microsite controller.
 */ 

var Template = require("bm_antavo/cartridge/scripts/utils/Template");
var guard = require("*/cartridge/scripts/guard");
var Config = require("bm_antavo/cartridge/scripts/utils/Config");
var Transaction = require("dw/system/Transaction");

/**
 * Displays a microsite page in an iFrame with the default layout
 */
function microsite() {
	Template.render("antavo/microsite", {
        micrositeUrl: Config.get().getCustom().microsite_url + "?c=" + session.customer.getID(),
        micrositeTemplate: Config.get().getCustom().microsite_template,
    });
}

/**
 * Opts-in the current customer from the session to the Antavo Loyalty.
 */
function optIn() {
    var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
    eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CUSTOMER_OPT_IN, this, {
        opt_in: true,
        customer: customer,
    });
    
    var redirect = request.httpParameterMap["redirect"];
    
    if (redirect) {
        response.redirect(redirect.stringValue);
    }
}

/**
 * Opts-out the current customer from the session to the Antavo Loyalty.
 */
function optOut() {
    var eventHandler = require("int_antavo/cartridge/scripts/events/Handler");
    eventHandler.Handler.fire(eventHandler.EVENT_AFTER_CUSTOMER_OPT_OUT, this, { customer: customer });
    
    var redirect = request.httpParameterMap["redirect"];
    
    if (redirect) {
        response.redirect(redirect.stringValue);
    }
}

exports.Show = guard.ensure(["https", "get"], microsite);
exports.OptIn = guard.ensure(["https", "post"], optIn);
exports.OptOut = guard.ensure(["https", "post"], optOut);
