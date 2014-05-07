var _ = require('underscore');

/*
 * ## UriPattern constructor
 *
 * @param {String} pattern to parse
 */
function UriPattern(pattern) {
    this.parts = pattern.replace(/^\/|\/$/g,'').split('/');
    this.vars = {};
    this.parts.forEach(function(part, i) {
        if(part.indexOf(':')>=0) {
            var match = this.match(part);
            match.order = i;
            this.vars[match.proxy] = match;
        }
    }.bind(this));
}

/*
 * ## UriPattern.get
 *
 * Generates a uri string from passed record key values and instance pattern
 *
 * @param {Object} rec
 * @return {String} full uri string
 */
UriPattern.prototype.getPath = function(rec) {
    return _.map(_.sortBy(this.vars, 'order'), function(match) {
        return this.getVal(match,rec);
    }.bind(this)).join('/') + '.html';
};

/*
 * ## UriPattern.getVal
 *
 * @param {Object} match
 * @param {Object} rec
 * @return {String}
 */
UriPattern.prototype.getVal = function(match,rec) {
    var val = rec[match.source];
    if(!val)    return;
    switch(match.filter) {
        case "YYYY":
            if(!(val instanceof Date))
                val = new Date(val);
            return val.getFullYear();
        case "MM":
            if(!(val instanceof Date))
                val = new Date(val);
            var mo = val.getMonth()+1;
            if(mo<10)   mo = "0" + mo;
            return mo + '';
    }
    return this.encode(val);
};

/*
 * ## UriPattern.encode
 *
 * Handles encoding a uri part
 *
 * @param {String} part to encode
 * @return {String} encoded string
 */
UriPattern.prototype.encode = function(part) {
    return encodeURIComponent(part.replace(/[^a-zA-Z0-9\-]+/g,'-').toLowerCase());
};

/*
 * ## UriPattern.match
 *
 * Regex match a uri part and return a describer object
 *
 * @param {String} part of uri (/part/)
 * @return {Object} describing what we found
 */
UriPattern.prototype.match = function(part) {
    var match = part.match(/\[([a-z]+\!)?([a-z]+)\]:([a-z]+)/i)
      , without = part.substr(1);
    
    return {
        source: match ? match[2] || match[3] : without,
        proxy:  match ? match[3] : undefined || without,
        filter: match && match[1] ? match[1].slice(0,match[1].length-1) : false
    };
};


module.exports = UriPattern;