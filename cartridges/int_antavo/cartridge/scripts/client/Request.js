/**
 * Utility request helper for the Antavo client.
 */

/**
 * @var {String}
 */
const _METHOD_GET = 'GET';

/**
 * @var {String}
 */
const _METHOD_POST = 'POST';

/**
 * @var {String}
 */
const _METHOD_PUT = 'PUT';

/**
 * @var {String}
 */
const _METHOD_DELETE = 'DELETE';

/**
 * @var {String}
 */
const _METHOD_PATCH = 'PATCH';

/**
 * Determines if the given HTTP method can receive request body.
 * 
 * @param {String} method
 * @returns {Boolean}
 */
function isBodyAllowed(method) {
    method = method.toUpperCase();
    return _METHOD_POST == method 
        || _METHOD_PUT == method 
        || _METHOD_PATCH == method;
}

/**
 * @param {String} url
 * @param {Object} params
 * @returns {String}
 */
function prepareUrl(url, params) {
    // If the params parameter is empty, there is no need to prepare anything
    if (!params) {
        return url;
    }
	
    // Creating the query string 
    var query = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    }).join('&');
	
    // Appending the created query string, then return
    return url + (url.indexOf('?') === -1 ? '?' : '&') + query;
}

exports.METHOD_GET = _METHOD_GET;
exports.METHOD_POST = _METHOD_POST;
exports.METHOD_PUT = _METHOD_PUT;
exports.METHOD_DELETE = _METHOD_DELETE;
exports.METHOD_PATCH = _METHOD_PATCH;
exports.isBodyAllowed = isBodyAllowed;
exports.prepareUrl = prepareUrl;
