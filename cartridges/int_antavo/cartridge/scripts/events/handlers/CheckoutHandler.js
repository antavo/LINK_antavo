/**
 * This handler object will be emitted automatically right after a checkout place.
 * 
 * @module int_antavo/scripts/events/handlers
 */

"use strict"

var Client = require("~/cartridge/scripts/Client");
var Exception = require('~/cartridge/scripts/Exception');
var Logger = require("dw/system/Logger");
var URLUtils = require("dw/web/URLUtils");

exports.Handler = function () {
    /**
     * @var {Number}
     */
    const ERR_INVALID_PAYLOAD = 330201;
    
    /**
     * @param {Object} order
     */
    this.createDefaultCheckoutData = function (order) {
        return {
            total: 0,
            transaction_id: order.UUID,
            currency: order.currencyCode,
            items: [],
            discount: 0,
            shipping: order.shippingTotalGrossPrice.value,
        };
    }
    
    /**
     * @param {Object} order
     * @returns {Object}
     */
    this.exportLineItemData = function (lineItem) {
        var subtotal = lineItem.price.value,
            adjustedSubtotal = lineItem.adjustedPrice.value
            discount = subtotal - adjustedSubtotal,
            quantity = lineItem.quantity.value;
        
        return {
            product_id: lineItem.productID,
            product_name: lineItem.productName,
            product_url: URLUtils.https("Product-Show", "pid", lineItem.productID).toString(),
            price: subtotal / quantity,
            discount: discount,
            subtotal: adjustedSubtotal,
            sku: lineItem.manufacturerSKU,
            quantity: quantity,
            product_category: "",
        };
    }
    
    /**
     * @param {Object} source
     * @param {Object=} data
     */
    this.handle = function (source, data) {
        try {
            if (!data || !data.order) {
                throw Exception.createException(
                    "Missing order from payload", 
                    ERR_INVALID_PAYLOAD
                ); 
            }

            var order = data.order;
            
            if (!order.customer.profile.custom["loyaltyOptIn"]) {
                return;
            }
            
            var lineItems = order.getAllProductLineItems(),
                request = this.createDefaultCheckoutData(order);
            
            for (var i in lineItems) {
                var lineItemData = this.exportLineItemData(lineItems[i].orderItem.lineItem);
                request["items"].push(lineItemData);
                request["discount"] += lineItemData.discount;
                request["total"] += lineItemData.subtotal;
            }
            
            Client.sendEvent(order.customer.ID, "checkout", request);
        } catch (e) {
            Logger.warn(e.message);
        }
    }
};
