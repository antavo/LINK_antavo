var ISML = require('dw/template/ISML');
var guard = require('*/cartridge/scripts/guard');
var client = require('~/cartridge/scripts/client');
var utils = require('~/cartridge/scripts/utils');
var Signer = require('~/cartridge/scripts/client/signature').Signer;

function renderJson(data) {
    response.setContentType('application/json');
    response.writer.print(JSON.stringify(data, null, 2));
}

function render(content) {
    response.setContentType('text/plain');
    response.writer.print(content);
}

function start() {
    var object = {'Test': 'kutya', 'MEHASD': 1, 'aa': 2, 'ab': 3};
    //object = utils.arrayChangeKeyCase(object);
    //object = utils.ksort(object);
    //renderJson(object);
    
    var url = 'https://test.antavo.com/uri?query=1#hash=2';
    //renderJson(utils.parseUrl(url));
    //renderJson(utils.parseStr(utils.parseUrl(url, 'query')));
    //renderJson(utils.httpBuildQuery(object));
    var signer = new Signer('st1', 'api_key', 'api_secret');
    //render(signer.createCanonicalHeaders(object));
    //render(signer.createCanonicalRequest('post', url, object, {pay: 'load'}));
    renderJson({key: signer.createSigningKey().toString()});
    //renderJson(utils.gmdate('Ymd H:i:s'));
    return;
    
    renderJson(session.customer.getID());
    return;
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
