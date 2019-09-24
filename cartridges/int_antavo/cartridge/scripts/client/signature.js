/**
 * Class to calculate signatures Escher v4 signatures.
 */

var Utils = require("~/cartridge/scripts/utils");
var Mac = require("dw/crypto/Mac");
var MessageDigest = require("dw/crypto/MessageDigest");
var Bytes = require("dw/util/Bytes");
var Encoding = require("dw/crypto/Encoding");
var Request = require("~/cartridge/scripts/client/request");

/**
 * @param {String} region  Region to use when sending request.
 * @param {String} key  The Antavo API key.
 * @param {String} secret  The Antavo API secret.
 * @param {Number} time  The exact request time.
 * @returns {Object}  The signer class' instance.
 */
function Signer(region, key, secret, time) {
    /**
     * Name of the Antavo service to use.
     * 
     * @var {String}
     */
    this.service = "api";
    
    /**
     * The exact request time; it should be the same
     * for each request.
     * 
     * @var {String}
     */
    this.time = time;
    
    /**
     * The Antavo API key.
     * 
     * @var {String}
     */
    this.key = key;
    
    /**
     * The Antavo API secret.
     * 
     * @var {String}
     */
    this.secret = secret;
    
    /**
     * Region to use when sending request.
     * 
     * @var {String}
     */
    this.region = region;
    
    /**
     * Creates canonical headers from the AWS request headers. It also appends
     * the list of used header names.
     * 
     * @param {Object} headers  Header key-value pairs.
     * @returns {String}  Processed headers for canonical request.
     */
    this.createCanonicalHeaders = function (headers) {
        // Converting header keys to lowercase
        headers = Utils.arrayChangeKeyCase(headers);
        // Sorting the headers by key
        headers = Utils.ksort(headers);
        // Creating the result string
        var canonicalHeaders = "";
        
        for (var key in headers) {
            var value = "" + headers[key];
            canonicalHeaders += key + ":" + value.trim() + "\n";
        }
        
        return canonicalHeaders + "\n" + Object.keys(headers).join(';');
    }
    
    /**
     * @param {String} method  Method to use in request.
     * @param {String} url  URL to send the request to.
     * @param {Object} headers  List of the used request headers.
     * @param {String} payload  The sent request data in string format.
     * @returns {String}  The formatted canonical request.
     * @link http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
     */
    this.createCanonicalRequest = function (method, url, headers, payload) {
    	var hasher = new MessageDigest(MessageDigest.DIGEST_SHA_256);
        // Parsing the query string of the url to an associative object
        var query = Utils.parseUrl(url, "query");
        
        if (query) {
        	query = Utils.ksort(utils.parseStr(query));
        }
        
        return [
            method,
            Utils.parseUrl(url, "path"),
            query ? Utils.httpBuildQuery(query) : "",
            this.createCanonicalHeaders(headers),
            hasher.digest(new Bytes(payload, "UTF-8")),
        ].join("\n");
    }
    
    /**
     * @param {String} method  Method to use in request.
     * @param {String} url  URL to send the request to.
     * @param {String} payload  The sent request data in string format.
     * @returns {String}  The formatted signature string.
     * @link http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
     */
    this.createSignatureString = function (method, url, payload) {
    	var hasher = new MessageDigest(MessageDigest.DIGEST_SHA_256);
    	var canonicalRequest = this.createCanonicalRequest(method, url, {
            Host: Utils.parseUrl(url, "host"),
            Date: Utils.gmdate("c", this.time),
        }, payload);
        
        return [
            "ANTAVO-HMAC-SHA256",
            Utils.gmdate("Ymd", this.time) + "T" + Utils.gmdate("His", this.time) + "Z",
            [
                Utils.gmdate("Ymd", this.time),
                this.region,
                this.service,
                "antavo_request",
            ].join("/"),
            hasher.digest(new Bytes(canonicalRequest, "UTF-8")),
        ].join("\n");
    }

    /**
     * Derives signing key based on current date, Antavo secret key, used region
     * and service.
     * 
     * @returns {String}  Hash value in raw binary representation.
     * @link http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
     */
    this.createSigningKey = function () {
        return Mac(Mac.HMAC_SHA_256).digest(
            "antavo_request",
            Mac(Mac.HMAC_SHA_256).digest(
                this.service,
                Mac(Mac.HMAC_SHA_256).digest(
                    this.region,
                    Mac(Mac.HMAC_SHA_256).digest(
                	    Utils.gmdate("Ymd", this.time),
                        "ANTAVO" + this.secret
            		)
                )
            )
        );
    }
    
    /**
     * @param {String} method  Method to use in request.
     * @param {String} url  URL to send the request to.
     * @param {Object} data  Data to append as URL query string for GET requests or to use as request body for others.
     * @returns {String}  The calculated signature string what will be appended to the request.
     */
    this.calculateSignature = function (method, url, data) {
        return Encoding.toHex(
            Mac(Mac.HMAC_SHA_256).digest(
                this.createSignatureString(
                    method,
                    url,
                    (Request.isBodyAllowed(method)) && Object.keys(data).length
                        ? Utils.httpBuildQuery(data)
                	    : ""
    	        ),
                this.createSigningKey()
            )
        );
    }
    
    /**
     * @param {String} signature  The calculated signature string.
     * @returns {String}  The entire "Authorization" header with API scopes.
     */
    this.getAuthorizationHeader = function (signature) {
    	return "ANTAVO-HMAC-SHA256 Credential={apiKey}/{date}/{region}/{service}/antavo_request, SignedHeaders=date;host, Signature={signature}"
    	    .replace("{apiKey}", this.key)
    	    .replace("{date}", Utils.gmdate("Ymd", this.time))
    	    .replace("{region}", this.region)
    	    .replace("{service}", this.service)
    	    .replace("{signature}", signature);
    }
};

exports.Signer = Signer;
