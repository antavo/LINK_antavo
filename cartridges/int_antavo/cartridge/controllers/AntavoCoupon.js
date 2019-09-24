var template = require('bm_antavo/cartridge/scripts/utils/template');
var guard = require('*/cartridge/scripts/guard');
var config = require('bm_antavo/cartridge/scripts/utils/config');
var PromotionMgr = require('dw/campaign/PromotionMgr');

var Error = function (message, code) {
	return {
		message: message || "",
		code: code || 0,
	};
}

function create() {
	var client = require("int_antavo/cartridge/scripts/client");
	try {
		var result = client.sendEvent("1", "point_add", {
			points: 100
		});
		template.renderJson(result);
	} catch (e) {
		template.renderJson(e);
	}
	
	return;
	var coupon, error;
	
	try {
		var post = request.httpParameterMap;
		
		if (!post.api_key || !post.api_key.stringValue) {
			throw Error("Missing required parameter 'api_key'");
		}
		
		if (!post.coupon_percentage || !post.coupon_percentage.stringValue) {
			throw Error("Missing required parameter 'coupon_percentage'");
		}
		
		var apiKey = post.api_key.stringValue;
		var couponPercentage = post.coupon_percentage.stringValue;
		
		if (config.getApiKey() != apiKey) {
			throw Error("Invalid API key");
		}
		
		if (!couponPercentage.match(/^\d+$/) || couponPercentage < 1 || couponPercentage > 100) {
			throw Error("Coupon percentage should be an integer between 1 and 100");
		}
	} catch (e) {
		error = e;
	} finally {
		if (error) {
			template.renderJson({
				"error": {
					"message": error.message,
					"code": error.code,
				},
			});
		} else {
			template.renderJson({
				"code": "asasdasd",
			});
		}
	}
}

exports.Create = guard.ensure(["post", "https"], create);
