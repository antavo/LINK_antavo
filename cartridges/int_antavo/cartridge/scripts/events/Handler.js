/**
 * 
 */

/**
 * This event will be triggered right after a successful customer opt-in. 
 */
const _EVENT_AFTER_CUSTOMER_OPT_IN = "afterCustomerOptIn";

/**
 * This event will be triggered right after a successful customer opt-in. 
 */
const _EVENT_AFTER_CUSTOMER_OPT_OUT = "afterCustomerOptOut";

/**
 * This event will be emitted right after a successful checkout place.
 */
const _EVENT_AFTER_CHECKOUT = "afterCheckout";

/**
 * 
 */
function Handler() {
	/**
	 * @var {Array}
	 */
	this.handlers = {};
	
	/**
	 * Constructs the EventHandler object with the default listener objects.
	 * 
	 * @returns {Object}
	 */
	this.init = function () {
		var OptInHandler = require("~/cartridge/scripts/events/handlers/OptInHandler").Handler;
		var OptOutHandler = require("~/cartridge/scripts/events/handlers/OptOutHandler").Handler;
		var CheckoutHandler = require("~/cartridge/scripts/events/handlers/CheckoutHandler").Handler;
		this.attachHandler(_EVENT_AFTER_CUSTOMER_OPT_IN, new OptInHandler());
		this.attachHandler(_EVENT_AFTER_CUSTOMER_OPT_OUT, new OptOutHandler());
		this.attachHandler(_EVENT_AFTER_CHECKOUT, new CheckoutHandler());
		return this;
	}
	
	/**
	 * Attach a listener to the events manager.
	 * 
	 * @param {String} eventName  Matching trigger eventNames will cause this listener to fire.
	 * @param {Object|Function} handler  The event handler object.
	 * @param {Number=} priority  Priority of the listener object; default: 100.
	 */
	this.attachHandler = function (eventName, handler, priority) {
	    priority = priority || 100;
	    
	    if (!this.handlers[eventName]) {
	        this.handlers[eventName] = {};
	    }
	    
	    if (!this.handlers[eventName][priority]) {
	        this.handlers[eventName][priority] = [];
	    }
	    
		this.handlers[eventName][priority].push(handler);
	}
	
	/**
	 * Fires an event in the events manager causing the active listeners to be notified about it.
	 * 
	 * @param {String} eventName  Matching trigger eventNames will cause this listener to fire.
	 * @param {Object} source  The event initiator object.
	 * @param {Object=} data  The passed additional payload.
	 */
	this.fire = function (eventName, source, data) {
		if (this.handlers[eventName]) {
			var handlers = this.handlers[eventName];
			
			for (var priority in handlers) {
				for (var i in handlers[priority]) {
				    var handler = handlers[priority][i];
				    
					if (typeof handler === "object" && typeof handler["handle"] === "function") {
						handler["handle"](source, data);
					} else if (typeof handler === "function") {
						handler(source, data);
					}
				}
			}
		}
	}
}

exports.Handler = (function (object) {
    var instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = object;
                
                if (typeof instance["init"] === "function") {
                    instance.init();
                }
            }
            
            return instance;
        }
    };
})(new Handler).getInstance();

exports.EVENT_AFTER_CUSTOMER_OPT_IN = _EVENT_AFTER_CUSTOMER_OPT_IN;
exports.EVENT_AFTER_CUSTOMER_OPT_OUT = _EVENT_AFTER_CUSTOMER_OPT_OUT;
exports.EVENT_AFTER_CHECKOUT = _EVENT_AFTER_CHECKOUT;
