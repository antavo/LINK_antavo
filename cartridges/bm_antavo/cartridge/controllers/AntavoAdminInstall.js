/**
 * @module bm_antavo/controllers
 */

"use strict"

var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Config = require("int_antavo/cartridge/scripts/Config");
var URLUtils = require('dw/web/URLUtils');
var ServiceRegistry = require("dw/svc/LocalServiceRegistry");
var Template = require("int_antavo/cartridge/scripts/Template");

/**
 * @param {String} name
 * @returns {Boolean}
 */
function isCustomObjectDefined(name) {
    try {
        return !!CustomObjectMgr.describe(name);
    } catch (e) {
        return false;
    }
}

/**
 * @returns {Boolean}
 */
function isHttpServiceCreated() {
    try {
        return !!ServiceRegistry.createService("antavo.http", {});
    } catch (e) {
        return false;
    }
}

/**
 * @returns {Boolean}
 */
function isHttpServiceConfigured() {
    try {
        var service = ServiceRegistry.createService("antavo.http", {});
        var credential = service.getConfiguration().getCredential();
        return credential.getUser() && credential.getPassword() && credential.getURL();
    } catch (e) {
        return false;
    }
}

/**
 * 
 */
function show() {
    Template.render("antavobm/install/show", { 
        ContinueURL: URLUtils.https("AntavoAdminSocialShare-ProcessSettings"),
        activeAntavoPage: 'install',
        title: 'Installation Status',
        config: Config.get(),
        isHttpServiceCreated: isHttpServiceCreated(),
        isHttpServiceConfigured: isHttpServiceConfigured(),
        isConfigObjectDefined: isCustomObjectDefined("AntavoConfig"),
        isQueueObjectDefined: isCustomObjectDefined("AntavoRequestQueue"),
    });
}

exports.Show = show;
exports.Show.public = true;
