var ISML = require('dw/template/ISML');
var guard = require('*/cartridge/scripts/guard');
var client = require('int_antavo/cartridge/scripts/utils/client');

function renderJson(data) {
    response.setContentType('application/json');
    response.writer.print(JSON.stringify(data, null, 2));
}

function start() {
	try {
		var res = client.getCustomer('1');
		//var res = client.sendEvent('1', 'point_add', {points: 0});
		renderJson(res);
		return;
	} catch (e) {
		renderJson(e);
		return;
	}
}

exports.Start = guard.ensure(['https', 'get'], start);
