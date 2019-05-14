/**
 * @param {Number} statusCode
 * @returns {Boolean}
 */
function isStatusAccepted(statusCode) {
	return statusCode >= 100 && statusCode < 400;	
}

/**
 * @param {String} result
 * @returns {Object}
 */
function parseJsonBody(result) {
	try {
		return JSON.parse(result);
	} catch (e) {
		return result;
	}
}

/**
 * @param {String} body
 * @param {String} contentType
 * @returns
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
