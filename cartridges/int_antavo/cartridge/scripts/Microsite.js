/**
 * @module int_antavo/scripts 
 */

"use strict"

var URLUtils = require('dw/web/URLUtils');

/**
 * @returns {String}
 */
function getMicrositeUrl() {
    if (session.customer.isAuthenticated()) {
        return URLUtils.https("LoyaltyMicrosite-Show");
    }
    
    return "#";
}

exports.getMicrositeUrl = getMicrositeUrl;
