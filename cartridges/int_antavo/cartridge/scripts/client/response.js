/**
 * Class to validate and parse Antavo API responses.
 */

/**
 * @param {Number} statusCode  The response's HTTP status code.
 * @returns {Boolean}  Validity of the response code.
 */
function isStatusAccepted(statusCode) {
    return statusCode >= 100 && statusCode < 400;	
}

/**
 * @param {String} result  The JSON response from Antavo API.
 * @returns {Object}  The derived Javascript object from the response.
 */
function parseJsonBody(result) {
    try {
        return JSON.parse(result);
    } catch (e) {
        return result;
    }
}

/**
 * @param {String} body  The raw Antavo API response.
 * @param {String} contentType  The "Content-Type" header from the response
 * @returns {Object}  The derived Javascript object from the response.
 */
function parseBody(body, contentType) {
    if (typeof contentType !== 'string') {
        return body;
    }

    switch (contentType.split(';')[0]) {
        case 'application/json':
            return parseJsonBody(body);
        default:
            return body;
	}
}

exports.isStatusAccepted = isStatusAccepted;
exports.parseBody = parseBody;
