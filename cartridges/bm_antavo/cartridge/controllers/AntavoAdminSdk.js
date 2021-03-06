/**
 * @module bm_antavo/controllers
 */

"use strict"

var TemplateHelper = require("int_antavo/cartridge/scripts/Template");
var URLUtils = require("dw/web/URLUtils");
var ConfigHelper = require("int_antavo/cartridge/scripts/Config");
var FlashMessageHelper = require("~/cartridge/scripts/FlashMessage");

/**
 *
 */
function settings() {
    TemplateHelper.render("antavobm/sdk/settings", {
        ContinueURL: URLUtils.https("AntavoAdminSdk-ProcessSettings"),
        activeAntavoPage: "sdk",
        title: "JS SDK Settings",
        config: ConfigHelper.get(),
    });
}

/**
 *
 */
function processSettings() {
    try {
        var params = request.httpParameterMap;
        ConfigHelper.save({
            sdk_url: params.sdk_url.stringValue,
            sdk_authentication_method: params.sdk_authentication_method.stringValue,
            sdk_hashing_method: params.sdk_hashing_method.stringValue,
        });
        // TODO: [pjtuxe@2019-05-16] Success message
    } catch (e) {
        // TODO: [pjtuxe@2019-05-16] Error message
    } finally {
        response.redirect(URLUtils.https("AntavoAdminSdk-Settings"));
    }
}

settings.public = true;
processSettings.public = true;
exports.Settings = settings;
exports.ProcessSettings = processSettings;
