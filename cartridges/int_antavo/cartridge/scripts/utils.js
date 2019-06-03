/**
 * 
 */

var DateHelper = require('~/cartridge/scripts/date');

/**
 * Equivalent implementation of the https://www.php.net/manual/en/function.array-change-key-case.php
 * 
 * @param {Object} object
 * @returns {Object}
 */
function arrayChangeKeyCase(obj, cs) {
    var caseFnc;
    var key;
    var result = {};

    if (obj && typeof obj === 'object') {
        caseFnc = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
        
        for (key in obj) {
            result[key[caseFnc]()] = obj[key];
        }
        
        return result;
    }

    return false;
}

/**
 * Equivalent implementation of the https://www.php.net/manual/en/function.ksort.php
 * 
 * @param {Object} obj
 * @returns {Object}
 */
function ksort(obj){
    var keys = Object.keys(obj).sort();
    var sorted = {};

    for (var i in keys) {
        sorted[keys[i]] = obj[keys[i]];
    }

    return sorted;
}

/**
 * @param {String} str
 * @param {String} component
 * @returns {Object}
 */
function parseUrl(str, component) {
    var key = [
      'source',
      'scheme',
      'authority',
      'userInfo',
      'user',
      'pass',
      'host',
      'port',
      'relative',
      'path',
      'directory',
      'file',
      'query',
      'fragment',
    ];
    var regex = new RegExp([
        '(?:([^:\\/?#]+):)?',
        '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
        '()',
        '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
    ].join(''));
    var m = regex.exec(str);
    var uri = {};
    var i = 14;

    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i];
        }
    }

    if (component) {
        return uri[component.toLowerCase()];
    }

    delete uri.source;
    return uri;
}

/**
 * @param {String} str
 * @param {Object} array
 * @returns
 */
function parseStr(str) {
    var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&');
    var sal = strArr.length;
    var i;
    var j;
    var ct;
    var p;
    var lastObj;
    var obj;
    var chr;
    var tmp;
    var key;
    var value;
    var postLeftBracketPos;
    var keys;
    var keysLen;

    var _fixStr = function (str) {
        return decodeURIComponent(str.replace(/\+/g, '%20'));
    }

    array = {};

    for (i = 0; i < sal; i++) {
        tmp = strArr[i].split('=');
        key = _fixStr(tmp[0]);
        value = (tmp.length < 2) ? '' : _fixStr(tmp[1]);

        while (key.charAt(0) === ' ') {
            key = key.slice(1);
        }

        if (key.indexOf('\x00') > -1) {
            key = key.slice(0, key.indexOf('\x00'));
        }

        if (key && key.charAt(0) !== '[') {
            keys = [];
            postLeftBracketPos = 0;

            for (j = 0; j < key.length; j++) {
                if (key.charAt(j) === '[' && !postLeftBracketPos) {
                    postLeftBracketPos = j + 1;
                } else if (key.charAt(j) === ']') {
                    if (postLeftBracketPos) {
                        if (!keys.length) {
                            keys.push(key.slice(0, postLeftBracketPos - 1));
                        }

                        keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                        postLeftBracketPos = 0;

                        if (key.charAt(j + 1) !== '[') {
                            break;
                        }
                    }
                }
            }
            
            if (!keys.length) {
                keys = [key];
            }

            for (j = 0; j < keys[0].length; j++) {
                chr = keys[0].charAt(j);
                
                if (chr === ' ' || chr === '.' || chr === '[') {
                    keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                }

                if (chr === '[') {
                    break;
                }
            }

            obj = array;

            for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
                lastObj = obj;

                if ((key === '' || key === ' ') && j !== 0) {
                    // Insert new dimension
                    ct = -1;

                    for (p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            if (+p > ct && p.match(/^\d+$/g)) {
                                ct = +p;
                            }
                        }
                    }

                    key = ct + 1;
                }

                // if primitive value, replace with object
                if (Object(obj[key]) !== obj[key]) {
                    obj[key] = {};
                }

                obj = obj[key];
            }

            lastObj[key] = value;
        }
    }
    
    return array;
}

/**
 * @param formdata
 * @param numericPrefix
 * @param argSeparator
 * @returns
 */
function httpBuildQuery(formdata, numericPrefix, argSeparator) {
    var value;
    var key;
    var tmp = [];

    var _httpBuildQueryHelper = function (key, val, argSeparator) {
        var k;
        var tmp = [];
        
        if (val === true) {
            val = '1';
        } else if (val === false) {
            val = '0';
        }
        
        if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                    if (val[k] !== null) {
                        tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator));
                    }
                }
                
                return tmp.join(argSeparator);
            } else if (typeof val !== 'function') {
                return urlencode(key) + '=' + urlencode(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    }

    if (!argSeparator) {
        argSeparator = '&';
    }
    
    for (key in formdata) {
        value = formdata[key];
        
        if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key;
        }
        
        var query = _httpBuildQueryHelper(key, value, argSeparator);
        
        if (query !== '') {
            tmp.push(query);
        }
    }

    return tmp.join(argSeparator);
}

/**
 * @param {String} str
 * @returns {String}
 */ 
function urlencode(str) {
    str = str + ''
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/~/g, '%7E')
      .replace(/%20/g, '+')
}

/**
 * @param {String} format
 * @param {Number} timestamp
 * @returns {String}
 */
function gmdate(format, timestamp) {    
    var dt = typeof timestamp === 'undefined' ? new Date() // Not provided
      : timestamp instanceof Date ? new Date(timestamp) // Javascript Date()
      : new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)

    timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;
    return DateHelper.date(format, timestamp);
}

exports.arrayChangeKeyCase = arrayChangeKeyCase;
exports.ksort = ksort;
exports.parseUrl = parseUrl;
exports.parseStr = parseStr;
exports.httpBuildQuery = httpBuildQuery;
exports.urlencode = urlencode;
exports.gmdate = gmdate;
