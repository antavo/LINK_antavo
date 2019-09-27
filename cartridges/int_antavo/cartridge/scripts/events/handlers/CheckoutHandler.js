/**
 * This handler object will be emitted automatically right after a checkout place.
 */

var Client = require("~/cartridge/scripts/Client");
var Exception = require('~/cartridge/scripts/client/exception');
var Logger = require("dw/system/Logger");

exports.Handler = function () {
    /**
     * @var {Number}
     */
    const ERR_INVALID_PAYLOAD = 330101;
    
    /**
     * 
     */
    this.handle = function (source, data) {
        try {
            if (!data || !data.checkout) {
                throw Exception.createException(
                    "Missing checkout from payload", 
                    ERR_INVALID_PAYLOAD
                ); 
            }
            
            Client.sendEvent(data.checkout.customer, "checkout", data.checkout);
        } catch (e) {
            Logger.warn(e.message);
        }
    }
};

