/**
 * This handler object will be emitted automatically right after a customer opt-in.
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
            if (!data || !data.customer) {
                throw Exception.createException(
                    "Missing customer from payload", 
                    ERR_INVALID_PAYLOAD
                ); 
            }
            
            Client.sendEvent(data.customer.id, "opt_in", data.customer);
        } catch (e) {
            Logger.warn(e.message);
        }
    }
};
