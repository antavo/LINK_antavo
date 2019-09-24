var transaction = require('dw/system/Transaction');
var Site = require('dw/system/Site');
var CustomObjectManager = require("dw/object/CustomObjectMgr");
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var HttpService = ServiceRegistry.get('antavo.http');

/**
 * @returns {String}
 */
function getCurrentSiteId() {
    return Site.getCurrent().getID();
}

/**
 * @returns {Object}
 */
function get() {
    var config = {};
    
    transaction.wrap(function () {
        config = CustomObjectManager.getCustomObject(
            'AntavoConfig',
            getCurrentSiteId()
        );
    });
    
    return config;
}

/**
 * @param {Object} data
 * @returns {Object}
 */
function save(data) {
    var config;
    
    transaction.wrap(function () {
        try {
            config = get();
            
            if (!config.getUUID()) {
                throw "Config not found";
            }
        } catch (e) {
            config = CustomObjectManager.createCustomObject(
                'AntavoConfig', 
                getCurrentSiteId()
            );
        }
    });
    
    // Saving the properties into the config object
    transaction.wrap(function () {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                config.custom[key] = data[key];
            }
        }
    });
    
    return config;
}

/**
 * Returns the configured API key from the default config storage.
 * 
 * @returns {String}
 */
function getApiKey() {
    return HttpService.getConfiguration().getCredential().getUser();
}

exports.get = get;
exports.save = save;
exports.getApiKey = getApiKey;

