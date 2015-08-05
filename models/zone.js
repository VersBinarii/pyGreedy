var Schema = require('mongoose').Schema;

exports.Region = new Schema({
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

exports.Zone = new Schema({
    zone_id: {
	type: String,
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

