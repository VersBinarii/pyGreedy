var Schema = require('mongoose').Schema;

exports.Account = new Schema({
    id : {
	type: String,
	required: true,
	unique: true
    },
    name : String,
    sapid : {
	type: String,
	required: true,
    },
    trunk : {
	type: String,
	required: true,
    },
    ratesheet : {
	type: String,
	required: true
    },
    discount: {
	type: String,
	required: false,
	default: ""
    },
    created : Date,
    updated : Date
});
