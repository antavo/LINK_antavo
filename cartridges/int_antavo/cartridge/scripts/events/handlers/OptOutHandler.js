/**
 * This handler object will be emitted automatically right after a customer opt-out.
 */

var Client = require("~/cartridge/scripts/Client");
var Exception = require('~/cartridge/scripts/client/Exception');
var Logger = require("dw/system/Logger");
var Transaction = require("dw/system/Transaction");

exports.Handler = function () {
    /**
     * @var {Number}
     */
    const ERR_INVALID_PAYLOAD = 330201;
    
    /**
     * @var {Number}
     */
    const ERR_INVALID_CUSTOMER = 330202;
    
    /**
     * @param {Object} source
     * @param {Object=} data
     */
    this.handle = function (source, data) {
        try {
            // If the event payload is not passed, return.
            if (!data) {
                throw Exception.createException("Missing event payload", ERR_INVALID_PAYLOAD); 
            }
            
            // If the customer is not a member of the payload, return.
            if (!data.customer) {
                throw Exception.createException("Missing customer from payload", ERR_INVALID_CUSTOMER);
            }
            
            var customer = data.customer;
            
            // Saving the loyalty flag to the customer
            Transaction.wrap(function () {
                customer.profile.custom['loyaltyOptIn'] = false;
            });
            
            // Sending API request to the Antavo API if the opt-in flag is true            
            Client.sendEvent(customer.ID, "opt_out", {});
        } catch (e) {
            Logger.warn(e.message);
        }
    }
};
