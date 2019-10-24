/**
 * FlashMessage helper for sending back handy success/error messages to the user. 
 */

"use strict"

/**
 * Clears the messages container
 */
function clear() {
    session.custom.antavoMessages = [];
}

/**
 * @param {String} message
 * @param {String=} type
 */
function addMessage(message, type) {
    if (!session.custom.antavoMessages) {
        session.custom.antavoMessages = [];
    }
    
    session.custom.antavoMessages.push({
        message: message,
        type: type || "success",
    });
}

/**
 * Adds a success message to the container
 * 
 * @param {String} message
 */
function success(message) {
    addMessage(message);
}

/**
 * Adds an error message to the container
 * 
 * @param {String} message
 */
function error(message) {
    addMessage(message, "error");
}

/**
 * Returns the internal messages container
 * 
 * @returns {Array}
 */
function getMessages() {
    return session.custom.antavoMessages || [];
}

exports.clear = clear;
exports.success = success;
exports.error = error;
exports.getMessages = getMessages;
