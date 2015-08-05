var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
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
    created : Date,
    updated : Date
});

var Number = new Schema({
    number: {
	type: String,
	unique: true,
	required: true
    },
    account: {
	type: String,
	required: true
    }
});

var RatesheetList = new Schema({
    name: {
	type: String,
	required: true,
	unique: true
    },
    rs: [{
	cc: {
	    type: String,
	    required: true
	},
	number: {
	    type: String,
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

var Region = new Schema({
    region_id: {
	type: String,
	unique: true,
	required: true
    },
    name: {
	type: String,
	required: true
    }
});

var Zone = new Schema({
    zone_id: {
	type: String,
	unique: true,
	required: true
    },
    name: {
	type: String,
	required: true
    },
    region: [{ type: Schema.Types.ObjectId, ref: 'Region' }] 
});

mongoose.model('Account', Account);
mongoose.model('Number', Number);
mongoose.model('RatesheetList', RatesheetList);
mongoose.model('Region', Region);
mongoose.model('Zone', Zone);
mongoose.connect(require('../config/database.js').url);
