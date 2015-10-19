'use strict'

module.exports = function(db){
    return db.model('Zone', ZoneSchema());
}

function ZoneSchema(){
    
    var Schema = require('mongoose').Schema;
        
    return new Schema({
        zone_id: {
	    type: Number,
	    unique: true,
	    required: true
        },
        name: {
	    type: String,
	    required: true
        },
        region: {
	    type: Number,
	    required: true
        }
    });
}
