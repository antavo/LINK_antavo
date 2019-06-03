var ISML = require('dw/template/ISML');
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var HttpService = ServiceRegistry.get('antavo.http');
var ConfigHelper = require('bm_antavo/cartridge/scripts/utils/config');

/**
 * @returns {Object}
 */
function getConfiguration() {
    return ConfigHelper.get().getCustom();
}

/**
 * @returns {String}
 */
function getApiKey() {
    return HttpService.getConfiguration().getCredential().getUser();
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
    ISML.renderTemplate('includes/js-sdk', {
        sdkUrl: getSdkUrl(),
        apiKey: getApiKey(),
        config: getConfiguration(),
        customerId: session.customer.getID(),
    });
}

exports.Include = include;
exports.Include.public = true;
