/**
 * @module int_antavo/scripts
 */

"use strict"

var URLUtils = require("dw/web/URLUtils");

/**
 * @param {Object} product
 * @return {Array}
 */
function getProductCategories(product) {
    return product.getAllCategories();
}

/**
 * @param {Object} product
 * @return {Array}
 */
function getProductCategoryNames(product) {
    var categories = getProductCategories(product),
        result = [];
    
    for (var i in categories) {
        result.push(categories[i].displayName);
    }
    
    return result;
}

/**
 * @param {Object} product
 * @returns {Number}
 */
function getProductPrice(product) {
    return product.getPriceModel().getPrice().getValue();
}

/**
 * @param {String} productId
 * @returns {String}
 */
function getProductUrl(productId) {
    return URLUtils.https("Product-Show", "pid", productId).toString();
}

exports.getProductCategories = getProductCategories;
exports.getProductCategoryNames = getProductCategoryNames;
exports.getProductPrice = getProductPrice;
exports.getProductUrl = getProductUrl;
