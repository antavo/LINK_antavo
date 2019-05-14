var ServiceRegistry = require('dw/svc/ServiceRegistry');
var ExceptionHelper = require('~/cartridge/scripts/utils/client/exception');
var RequestHelper = require('~/cartridge/scripts/utils/client/request');
var ResponseHelper = require('~/cartridge/scripts/utils/client/response');
var HttpService = ServiceRegistry.get('antavo.http');

/**
 * @param {Number} statusCode
 * @returns {Boolean}
 */
function isAcceptableStatusCode(statusCode) {
    return statusCode > 199 && statusCode < 300;
}

/**
 * @returns {Object}
 */
function getConfiguration() {
    return HttpService.getConfiguration().getCredential();
}

/**
 * @returns {String}
 */
function getApiUrl() {
    return "https://" + getConfiguration().getURL().replace(/^http(s)?:\/\//, '');
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
function getApiSecret() {
    return getConfiguration().getPassword();
}

/**
 * @param {String} method
 * @param {String} uri
 * @param {Object} data
 * @returns
 */
function send(method, uri, data) {
    var httpClient = new dw.net.HTTPClient();
    data = data || {};
    data['api_key'] = getApiKey();
    httpClient.open(
        method, 
        RequestHelper.prepareUrl(
            getApiUrl() + "/" + uri.replace(/^\//, ''), 
            !RequestHelper.isBodyAllowed(method) ? data : null
        )
    );
	// Adding the default request headers
    httpClient.setRequestHeader('Content-Type', 'application/json; charset="UTF-8"');
    httpClient.setRequestHeader('User-Agent', 'SFCC Cartridge Client 19.5.2');
    // TODO: [fekete_zsolt@2019-05-14] Signing the request
    httpClient.setTimeout(3000);
    // Performing the request
    httpClient.send(RequestHelper.isBodyAllowed(method) ? JSON.stringify(data) : '');

    // If the response status code is not 2xx, return
    if (!ResponseHelper.isStatusAccepted(httpClient.statusCode)) {
        var response = ResponseHelper.parseBody(
            httpClient.errorText,
            httpClient.getResponseHeader('Content-Type')
        );
        throw ExceptionHelper.createException(
            response.error.message, 
            httpClient.statusCode
        );
    }
	
    // Parsing the JSON response, then return
    return ResponseHelper.parseBody(
        httpClient.text, 
        httpClient.getResponseHeader('Content-Type')
    );
}

/**
 * @param {String} id
 * @returns {Object}
 */
function getCustomer(id) {
    return send(
        RequestHelper.METHOD_GET, 
        '/customers/' + encodeURIComponent(id)
    );
}

/**
 * @param {String} customer
 * @param {String} action
 * @param {Object=} data
 * @returns {Object}
 */
function sendEvent(customer, action, data) {
    return send(RequestHelper.METHOD_POST, '/events', {
        customer: customer,
        action: action,
        data: data
    });
}

exports.getApiUrl = getApiUrl;
exports.getCustomer = getCustomer;
exports.send = send;
exports.sendEvent = sendEvent;
