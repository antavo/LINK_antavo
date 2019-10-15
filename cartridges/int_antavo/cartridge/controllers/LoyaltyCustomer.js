/**
 * @module  controllers/LoyaltyCustomer
 */

'use strict';

var Config = require("bm_antavo/cartridge/scripts/utils/Config");
var Exception = require("~/cartridge/scripts/client/Exception");
var guard = require("*/cartridge/scripts/guard");
var Template = require("bm_antavo/cartridge/scripts/utils/Template");
var Transaction = require("dw/system/Transaction");

/**
 * @var {Number}
 */
const ERR_INVALID_REQUEST = 340101;

/**
 * @var {Number}
 */
const ERR_INVALID_CUSTOMER = 340102;

/**
 * @var {Number}
 */
const ERR_INVALID_API_KEY = 340103;

/**
 * @var {Regex}
 */
const DATA_PROPERTY_REGEX = /^data\[(.+)\]$/i;

/**
 * @param {String} property
 * @returns {String}
 */
function getCustomerDataProperty(property) {
    var matches = property.match(DATA_PROPERTY_REGEX);
    
    if (!matches) {
        return null;
    }
    
    return matches[1];
}

/**
 * 
 */
function sync() {
    var error, customer;
    
    try {
        var data = request.httpParameterMap;
        
        if (
            !data 
            || !data.api_key 
            || !data.api_key.stringValue 
            || !data.customer
            || !data.customer.stringValue
        ) {
            throw Exception.createException(
                "Invalid request given",
                ERR_INVALID_REQUEST
            );
        }
        
        if (Config.getApiKey() !== data.api_key.stringValue) {
            throw Exception.createException(
                "Invalid API key given",
                ERR_INVALID_API_KEY
            );
        }
        
        var CustomerMgr = require("dw/customer/CustomerMgr");
        customer = CustomerMgr.getCustomerByLogin(data.customer.stringValue);
        
        if (!customer) {
            throw Exception.createException(
                "Invalid customer given",
                ERR_INVALID_CUSTOMER
            );
        }
        
        Transaction.wrap(function () {
            var properties = data;
            
            for (var prop in properties) {
                var property = getCustomerDataProperty(prop); 

                if (property) {
                    var val = properties[prop];
                    customer.profile.custom[property] = val;
                }
            }
        });
    } catch (e) {
        error = e;
    } finally {
        if (error) {
            Template.renderJson({
                error: error,
            });
        } else {
            var properties = customer.profile.custom;
            Template.renderJson({
                id: customer.ID,
                custom: Object.keys(properties).reduce(
                    function (carry, property) {
                        carry[property] = properties[property];
                        return carry;
                    }, 
                    {}
                ),
            });
        }
    }
}

exports.Sync = guard.ensure(["https", "post"], sync);
