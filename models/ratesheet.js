var Schema = require('mongoose').Schema;

exports.RatesheetList = new Schema({
    name: {
	type: String,
	required: true,
	unique: true
    },
    rstype: {
	type: String,
	required: true
    },
    rs: [{
	cc: {
	    type: String,
	    required: true
	},
	number: {
	    type: String,
	   // unique: true,
	    required: true
	},
	zone: {
	    type: String,
	    required: true
	},
	rate_type: {
	    type: String,
	    required: true
	},
	peak: {
	    type: String,
	    required: true
	},
	offpeak: {
	    type: String,
	    required: true
	},
	wknd: {
	    type: String,
	    required: true
	},
	flatcharge: {
	    type: String,
	    required: true
	}
    }]
});