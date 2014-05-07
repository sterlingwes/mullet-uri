/*
 * # Uri
 *
 * Uri helper for parsing and building page / resource uris
 *
 */
 
var _ = require('underscore')
  , UriPattern = require('./pattern');

module.exports = function(db) {
    
    var UriRec = db.schema('mullet_uris', {
        fields: {
            full:   {
                type:   String
            },
            record: {
                type:   String
            },
            db: {
                type:   String
            },
            created: {
                type:   Date
            }
        }
    });
    
    
    return {
        
        Pattern:    UriPattern,
      
        /*
         * ## getUri
         *
         * @param {String|Object} pattern like /my/page/:name to match with passed rec keys or instance of UriPattern
         * @param {Object} rec with keys to match pattern
         * @return {String} path to file to write
         */
        get: function(pattern, rec) {
            if(typeof pattern !== 'object')
                pattern = new UriPattern(pattern);
                
            return pattern.getPath(rec);
        },
        
        register: function() {
            
        }
        
    };
};