var Template = require("bm_antavo/cartridge/scripts/utils/Template");
var guard = require("*/cartridge/scripts/guard");
var Config = require("bm_antavo/cartridge/scripts/utils/Config");

/**
 * Displays a microsite page in an iFrame with the default layout
 */
function microsite() {
	Template.render("antavo/microsite", {
        micrositeUrl: Config.get().getCustom().microsite_url + "?c=" + session.customer.getID(),
        micrositeTemplate: Config.get().getCustom().microsite_template,
    });
}

microsite.public = true;
exports.Show = microsite;
