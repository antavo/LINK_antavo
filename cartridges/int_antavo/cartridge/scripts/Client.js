/**
 * Class to perform operations on an arbitrary Antavo API.
 * 
 * @module int_antavo/scripts
 */

"use strict"

var ServiceRegistry = require("dw/svc/ServiceRegistry");
var ExceptionHelper = require("~/cartridge/scripts/Exception");
var Request = require("~/cartridge/scripts/client/Request");
var ResponseHelper = require("~/cartridge/scripts/client/Response");
var HttpService = ServiceRegistry.get("antavo.http");
var Utils = require("~/cartridge/scripts/Utils");
var Signature = require("int_antavo/cartridge/scripts/client/Signature");
var Mac = require("dw/crypto/Mac");
var Encoding = require("dw/crypto/Encoding");
var Logger = require("dw/system/Logger");

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
 * @param {String} uri
 * @param {String} method
 * @param {Object=} data
 * @returns {String}
 */
function getPreparedRequestUrl(method, uri, data) {
    return Request.prepareUrl(
        getApiUrl() + "/" + uri.replace(/^\//, ""), 
        !Request.isBodyAllowed(method) ? data : null
    );
}

/**
 * @param {String} method
 * @param {String} uri
 * @param {Object} data
 * @returns {Object}
 */
function createServiceConfiguration(method, uri, data) {
    return {
        /**
         * @param {dw.svc.HTTPService} svc
         * @param {Object=} params
         */
        createRequest: function (svc, params) {
            var url = getPreparedRequestUrl(method, uri, data);
            
            if (Request.isBodyAllowed(method) && Object.keys(data).length) {
                var payload = Utils.httpBuildQuery(data);
            }
            
            svc.setURL(url);
            svc.setRequestMethod(method);
            svc.addHeader("Content-Type", "application/x-www-form-urlencoded; charset='UTF-8'");
            svc.addHeader("User-Agent", "SFCC Client 19.10.1");
            
            var time = 1 * (new Date().getTime() / 1000).toFixed(0);
            var signer = new Signature.Signer(getRegion(), getApiKey(), getApiSecret(), time);
            svc.addHeader("Authorization", signer.getAuthorizationHeader(signer.calculateSignature(method, url, data)));
            svc.addHeader("Date", Utils.gmdate("c", time));
            svc.addHeader("Host", Utils.parseUrl(url, "host"));
            
            return payload || "";
        },
        
        /**
         * @param {dw.svc.HTTPService} svc
         * @param {dw.net.HTTPClient} client
         */
        parseResponse: function (svc, client) {
            return JSON.parse(client.text);
        },
    };
}

/**
 * @param {String} method
 * @param {String} uri
 * @param {Object=} data
 * @returns {Object}
 */
function send(method, uri, data) {
    try {
        data = data || {};
        
        var registry = require("dw/svc/LocalServiceRegistry");
        var service = registry.createService("antavo.http", createServiceConfiguration(method, uri, data));
        
        // Performing the API request
        var result = service.call();
        
        if (result.OK != result.status) {
            // TODO: exception code
            throw ExceptionHelper.createException(result.errorMessage);
        }
        
        var response = result.object;
        
        if (response.error) {
            throw ExceptionHelper.createException(
                response.error.message,
                response.error.code
            );
        }
        
        return response;
    } catch (e) {
        Logger.warn(JSON.stringify(e));
    }
}

/**
 * @param {String} id
 * @returns {Object}
 */
function getCustomer(id) {
    return send(
        Request.METHOD_GET, 
        "/customers/" + encodeURIComponent(id)
    );
}

/**
 * @param {String} customer
 * @param {String} action
 * @param {Object=} data
 * @returns {Object}
 */
function sendEvent(customer, action, data) {
    return send(Request.METHOD_POST, "/events", {
        customer: customer,
        action: action,
        data: data,
    });
}

exports.getApiUrl = getApiUrl;
exports.getCustomer = getCustomer;
exports.send = send;
exports.sendEvent = sendEvent;
