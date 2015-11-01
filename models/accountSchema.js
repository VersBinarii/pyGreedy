module.exports = function(db){
    return db.model('Account', AccountSchema());
}

function AccountSchema(){
    var Schema = require('mongoose').Schema;

    return new Schema({
        id : {
	    type: String, required: true, unique: true
        },
        name : String,
        sapid : {
	    type: String, required: true
        },
        identifier : {
	    type: String, required: true
        },
        ratesheet : {
	    type: String, required: false
        },
        discount: {
	    type: String, required: false, default: ""
        },
        parent_company: {
            type: String, required: false, default: this.name
        },
        vat: {
            type: Number, required: false, default: 23
        },
        address1 : { type: String },
        address2 : { type: String },
        address3 : { type: String },
        address4 : { type: String },
        address5 : { type: String },


        extracharge: [{
            type: Schema.Types.ObjectId, ref: 'Extracharge'
        }],
        
        created : Date,
        updated : Date
    });
}
