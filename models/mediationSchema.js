module.exports = function(db){
    return db.model('MediatedCall', MediatedCallSchema());
}

function MediatedCallSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        call_date: {
	    type: Date,
	    required: true
        },
        length: {
	    type: Number,
	    required: true
        },
        calling_num: {
	    type: String,
	    required: true
        },
        direction: {
	    type: String,
	    required: true
        },
        called_num: {
	    type: String,
	    required: true
        },
        calltype: {
	    type: String,
	    required: true
        },
        account_id: {
	    type: String,
	    required: true
        },
        valid: {
	    type: Boolean,
	    required: true
        },
        note: {
	    type: String
        }
    });
}
