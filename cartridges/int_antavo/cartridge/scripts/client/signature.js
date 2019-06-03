/**
 * 
 */

var utils = require('~/cartridge/scripts/utils');
var Mac = require('dw/crypto/Mac');

var Signer = function Signer(region, key, secret) {
    /**
     * @var {String}
     */
    this.service = 'api';
    
    /**
     * @var {String}
     */
    this.time = new Date() * 1;
    
    /**
     * @var {String}
     */
    this.key = key;
    
    /**
     * @var {String}
     */
    this.secret = secret;
    
    /**
     * @param {Object} headers
     * @returns {String}
     */
    this.createCanonicalHeaders = function (headers) {
        // Converting header keys to lowercase
        headers = utils.arrayChangeKeyCase(headers);
        // Sorting the headers by key
        headers = utils.ksort(headers);
        // Creating the result string
        var canonicalHeaders = '';
        
        for (var key in headers) {
            var value = "" + headers[key];
            canonicalHeaders += key + ":" + value.trim() + "\n";
        }
        
        return canonicalHeaders + "\n" + Object.keys(headers).join(';');
    }
    
    /**
     * @param {String} method
     * @param {String} url
     * @param {Object} headers
     * @param {String} payload
     * @returns {String}
     */
    this.createCanonicalRequest = function (method, url, headers, payload) {
        // Parsing the query string of the url to an associative object
        var query = utils.parseStr(utils.parseUrl(url, 'query'));
        // Sorting the query object by key
        query = utils.ksort(query);
        return [
            method,
            utils.parseUrl(url, 'path'),
            utils.httpBuildQuery(query),
            this.createCanonicalHeaders(headers),
            // TODO: hash(sha256, payload)
        ].join("\n");
    }
    
    /**
     * @param {String} method
     * @param {String} url
     * @param {Object} payload
     * @returns {String}
     * @link http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
     */
    this.createSignatureString = function (method, url, payload) {
        var canonicalRequest = createCanonicalRequest(method, url, {
            Host: utils.parseUrl(url, 'host'),
            Date: utils.gmdate('c', this.time),
        }, payload);
        
        return [
            'ANTAVO-HMAC-SHA256',
            utils.gmdate('Ymd\THis\Z', this.time),
            [
                utils.gmdate('Ymd'),
                this.region,
                this.service,
                'antavo_request',
            ].join('/'),
            '', // TODO: hash('sha256', canonicalRequest)
        ].join("\n");
    }

    /**
     * Derives signing key based on current date, Antavo secret key, used region
     * and service.
     * 
     * @returns {String}
     * @link http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
     */
    this.createSigningKey = function () {
        var Hasher = Mac(Mac.HMAC_SHA_256);
        return Hasher.digest(
            'antavo_request',
            Hasher.digest(
                this.service,
                Hasher.digest(
                    this.region,
                    Hasher.digest(
                        this.time,
                        'ANTAVO' + this.secret
                    )
                )
            )
        );
    }
};

exports.Signer = Signer;
