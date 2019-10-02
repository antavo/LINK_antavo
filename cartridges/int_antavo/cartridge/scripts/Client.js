/**
 * Class to perform operations on an arbitrary Antavo API. 
 */

var ServiceRegistry = require('dw/svc/ServiceRegistry');
var ExceptionHelper = require('~/cartridge/scripts/client/Exception');
var Request = require('~/cartridge/scripts/client/Request');
var ResponseHelper = require('~/cartridge/scripts/client/Response');
var HttpService = ServiceRegistry.get('antavo.http');
var Utils = require('~/cartridge/scripts/Utils');
var Signature = require("int_antavo/cartridge/scripts/client/Signature");
var Mac = require("dw/crypto/Mac");
var Encoding = require("dw/crypto/Encoding");

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
    return "https://" + getConfiguration().getURL().replace(/^http(s)?:\/\//, "");
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
 * @returns {String}
 */
function getRegion() {
	return getConfiguration().getURL().split(".")[1];
}

/**
 * @param {String} method
 * @param {String} uri
 * @param {Object} data
 * @returns {Object}
 * @throws Exception  When the API response is malformed.
 */
function send(method, uri, data) {
    var httpClient = new dw.net.HTTPClient();
    data = data || {};
    //data['api_key'] = getApiKey();
    var url = Request.prepareUrl(
        getApiUrl() + "/" + uri.replace(/^\//, ''), 
        !Request.isBodyAllowed(method) ? data : null
    );
    httpClient.open(method, url);
	// Adding the default request headers
    httpClient.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset='UTF-8'");
    httpClient.setRequestHeader("User-Agent", "SFCC Client 19.10.1");
    
    if (Request.isBodyAllowed(method) && Object.keys(data).length) {
        var payload = Utils.httpBuildQuery(data);
    }
    
    // Adding the signature string
    var time = 1 * (new Date().getTime() / 1000).toFixed(0);
    var signer = new Signature.Signer(getRegion(), getApiKey(), getApiSecret(), time);
    httpClient.setRequestHeader("Authorization", signer.getAuthorizationHeader(signer.calculateSignature(method, url, data)));
    httpClient.setRequestHeader("Date", Utils.gmdate("c", time));
    httpClient.setRequestHeader("Host", Utils.parseUrl(url, "host"));
    
    // Set the request timeout to 3s
    httpClient.setTimeout(3000);
    // Performing the request
    httpClient.send(Request.isBodyAllowed(method) ? payload : '');

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
        Request.METHOD_GET, 
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
    return send(Request.METHOD_POST, '/events', {
        customer: customer,
        action: action,
        data: data
    });
}

exports.getApiUrl = getApiUrl;
exports.getCustomer = getCustomer;
exports.send = send;
exports.sendEvent = sendEvent;
