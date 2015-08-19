module.exports = function(db){
    return db.model('Region', RegionSchema());
}

function RegionSchema(){
    
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        region_id: {
	    type: Number,
	    unique: true,
	    required: true
        },
        name: {
	    type: String,
	    required: true
        }
    });
}
