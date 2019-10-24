/**
 * @module int_antavo_controllers/controllers
 */

"use strict"

var ISML = require("dw/template/ISML");
var ServiceRegistry = require("dw/svc/ServiceRegistry");
var HttpService = ServiceRegistry.get("antavo.http");
var Config = require("int_antavo/cartridge/scripts/Config");

/**
 *
 */
function include() {
    ISML.renderTemplate("antavo/includes/js-sdk", {
        sdkUrl: Config.getSdkUrl(),
        apiKey: Config.getApiKey(),
        config: Config.getConfiguration(),
        customerId: session.customer.getID(),
    });
}

exports.Include = include;
exports.Include.public = true;
