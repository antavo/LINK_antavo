/**
 * 
 */

var ISML = require('dw/template/ISML');
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var HttpService = ServiceRegistry.get('antavo.http');
var config = require('bm_antavo/cartridge/scripts/utils/Config');

/**
 * @returns {Object}
 */
function getConfiguration() {
    return config.get().getCustom();
}

/**
 * @returns {String}
 */
function getSdkUrl() {
    return getConfiguration().sdk_url;
}

/**
 *
 */
function include() {
    ISML.renderTemplate('antavo/includes/js-sdk', {
        sdkUrl: getSdkUrl(),
        apiKey: config.getApiKey(),
        config: getConfiguration(),
        customerId: session.customer.getID(),
    });
}

exports.Include = include;
exports.Include.public = true;
