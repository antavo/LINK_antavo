/**
 * 
 */

var ConfigHelper = require('bm_antavo/cartridge/scripts/utils/Config');
var URLUtils = require('dw/web/URLUtils');

/**
 * @returns {String}
 */
function getMicrositeUrl() {
    if (session.customer.isAuthenticated()) {
        return URLUtils.https('AntavoMicrosite-Show');
    }
    
    return '#';
     
}

exports.getMicrositeUrl = getMicrositeUrl;
