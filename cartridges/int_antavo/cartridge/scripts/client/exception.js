
/**
 * @param {String} message
 * @param {Number} code
 * @returns {Object}
 */
function createException(message, code) {
    return {
        type: "AntavoException",
        message: message,
        code: code
    };
}

exports.createException = createException;
