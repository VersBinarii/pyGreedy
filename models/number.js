var Schema = require('mongoose').Schema;

exports.Number = new Schema({
    number: {
	type: String,
	required: true
    },
    account: {
	type: String,
	required: true
    }
});
