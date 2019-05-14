var ISML = require('dw/template/ISML');
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var HttpService = ServiceRegistry.get('antavo.http');

/**
 * @returns {Object}
 */
function getConfiguration() {
    return HttpService.getConfiguration().getCredential();
}

/**
 * @returns {String}
 */
function getApiKey() {
    return getConfiguration().getUser();
}

/**
 * @returns {String}
 */
function getSdkUrl() {
    return "//" + getConfiguration().getURL().replace(/^http(s)?:\/\//, '') + "/sdk/latest-apps-rc";
}

/**
 *
 */
function include() {
    ISML.renderTemplate('includes/js-sdk', {
        sdkUrl: getSdkUrl(),
        apiKey: getApiKey(),
        customerId: session.customer.getID(),
    });
}

exports.Include = include;
exports.Include.public = true;
