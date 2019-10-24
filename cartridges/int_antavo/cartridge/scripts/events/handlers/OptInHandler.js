/**
 * This handler object will be emitted automatically right after a customer opt-in.
 * 
 * @module int_antavo/scripts/events/handlers
 */

"use strict"

var Client = require("~/cartridge/scripts/Client");
var Exception = require("~/cartridge/scripts/Exception");
var Logger = require("dw/system/Logger");
var Transaction = require("dw/system/Transaction");

exports.Handler = function () {
    /**
     * @var {Number}
     */
    const ERR_INVALID_PAYLOAD = 330101;
    
    /**
     * @var {Number}
     */
    const ERR_INVALID_CUSTOMER = 330102;
    
    /**
     * @var {Number}
     */
    const ERR_INVALID_FLAG = 330103;
    
    /**
     * @param {Object} customer
     * @returns {Object}
     */
    this.exportCustomerData = function (customer) {
        return {
            email: customer.profile.email,
            first_name: customer.profile.firstName,
            last_name: customer.profile.lastName,
        };
    }
    
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
            
            // If the opt-in flag is not a member of the payload, return.
            if (typeof data.opt_in === "undefined") {
                throw Exception.createException("Missing opt-in flag from payload", ERR_INVALID_FLAG);
            }
            
            var customer = data.customer;
            
            // Saving the loyalty flag to the customer
            Transaction.wrap(function () {
                customer.profile.custom["loyaltyOptIn"] = !!data.opt_in;
            });
            
            // Sending API request to the Antavo API if the opt-in flag is true            
            if (data.opt_in) {
                Client.sendEvent(customer.ID, "opt_in", this.exportCustomerData(customer));
            }
        } catch (e) {
            Logger.warn(e.message);
        }
    }
};
