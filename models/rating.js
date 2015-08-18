var Schema = require('mongoose').Schema;

exports.RatedCall = new Schema({
    acc_id: {
        type: String,
        required: true
    },
    call_date: {
	type: Date,
	required: true
    },
    calling_num: {
	type: String,
	required: true
    },
    called_num: {
	type: String,
	required: true
    },
    zone_name: {
        type: String
    },
    region_name: {
        type: String,
        required: true
    },
    length: {
	type: Number,
	required: true
    },
    charge: {
        type: Number,
        required: true
    }
});
