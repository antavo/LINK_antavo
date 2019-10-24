/**
 * Class to cast Antavo API error message and code to Javascript exception object.
 * 
 * @module int_antavo/scripts
 */

"use strict"

/**
 * @param {String} message  The error message from the API response.
 * @param {Number} code  The error code from the API response.
 * @returns {Object}  The exception object.
 */
function createException(message, code) {
    return {
        type: "AntavoException",
        message: message,
        code: code
    };
}

exports.createException = createException;
