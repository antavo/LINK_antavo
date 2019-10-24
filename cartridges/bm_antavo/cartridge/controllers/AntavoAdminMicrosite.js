/**
 * @module bm_antavo/controllers
 */

"use strict"

var TemplateHelper = require("int_antavo/cartridge/scripts/Template");
var ConfigHelper = require("int_antavo/cartridge/scripts/Config");
var URLUtils = require("dw/web/URLUtils");

/**
 * 
 */
function settings() {
    TemplateHelper.render("antavobm/microsite/settings", {
        ContinueURL: URLUtils.https("AntavoAdminMicrosite-ProcessSettings"),
        activeAntavoPage: "microsite",
        title: "Microsite Configuration",
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
           microsite_url: params.microsite_url.stringValue,
           microsite_template: params.microsite_template.stringValue,
       });
       // TODO: [pjtuxe@2019-05-16] Success message
   } catch (e) {
       // TODO: [pjtuxe@2019-05-16] Error message
   } finally {
       response.redirect(URLUtils.https("AntavoAdminMicrosite-Settings"));
   }
}

exports.Settings = settings;
exports.Settings.public = true;
exports.ProcessSettings = processSettings;
exports.ProcessSettings.public = true;
