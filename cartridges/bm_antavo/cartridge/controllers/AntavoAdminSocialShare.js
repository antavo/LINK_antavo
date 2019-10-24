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
    TemplateHelper.render("antavobm/socialshare/settings", {
        ContinueURL: URLUtils.https("AntavoAdminSocialShare-ProcessSettings"),
        activeAntavoPage: "socialshare",
        title: "Social Share Settings",
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
           social_share_enabled: params.social_share_enabled.stringValue,
       });
       // TODO: [pjtuxe@2019-05-16] Success message
   } catch (e) {
       // TODO: [pjtuxe@2019-05-16] Error message
   } finally {
       response.redirect(URLUtils.https("AntavoAdminSocialShare-Settings"));
   }
}

exports.Settings = settings;
exports.Settings.public = true;
exports.ProcessSettings = processSettings;
exports.ProcessSettings.public = true;
