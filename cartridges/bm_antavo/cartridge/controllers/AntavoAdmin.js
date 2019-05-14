var ISML = require('dw/template/ISML');

/**
 * Renders the given template with the given parameters.
 * It uses the default way to render templates, but it is fail-safe.
 * 
 * @param {String} template
 * @param {Object} data
 */
function render(template, data) {
	if (typeof data !== 'object') {
		data = {};
	}
	
	try {
		ISML.renderTemplate(template, data);
	} catch (e) {
		throw new Error(e.javaMessage + '\n\r' + e.stack, e.fileName, e.lineNumber);
	}
}

/**
 *
 */
function settings() {
	render('components/error');
}

/**
 * 
 */
function logs() {
	render('components/error');
}

settings.public = true;
logs.public = true;

exports.Settings = settings;
exports.Logs = logs;
