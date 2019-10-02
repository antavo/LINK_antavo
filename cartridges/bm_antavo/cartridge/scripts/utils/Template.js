/**
 * Template utility helper class with rendering related stuffs. 
 */

var ISML = require('dw/template/ISML');

/**
 * @param {Object} data
 * @returns
 */
function renderJson(data) {
    response.setContentType('application/json');
    response.writer.print(JSON.stringify(data, null, 2));
}

/**
 * @param {String} templateName
 * @param {Object} data
 */
function render(templateName, data) {
    if (typeof data !== 'object') {
        data = {}; // eslint-disable-line no-param-reassign
    }
    
    try {
        ISML.renderTemplate(templateName, data);
    } catch (e) {
        throw new Error(e.javaMessage + '\n\r' + e.stack, e.fileName, e.lineNumber);
    }
}

exports.render = render;
exports.renderJson = renderJson;
