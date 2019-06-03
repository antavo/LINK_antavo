var TemplateHelper = require('bm_antavo/cartridge/scripts/utils/template');
var guard = require('*/cartridge/scripts/guard');
var ConfigHelper = require('bm_antavo/cartridge/scripts/utils/config');

/**
 * Displays a microsite page in an iFrame with the default layout
 */
function microsite() {
    TemplateHelper.render('microsite', {
        micrositeUrl: ConfigHelper.get().getCustom().microsite_url,
        micrositeTemplate: ConfigHelper.get().getCustom().microsite_template,
    });
}

microsite.public = true;
exports.Show = microsite;
