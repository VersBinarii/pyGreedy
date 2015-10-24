module.exports = function(db){
    return db.model('Number', NumberSchema());
}

function NumberSchema(){

    var Schema = require('mongoose').Schema;
    
    return new Schema({
        number: {
	    type: String, required: true, unique: true, index: true
            
        },
        account: {
	    type: String, required: true
        }
    });
}
