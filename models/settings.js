var Schema = require('mongoose').Schema;

exports.Settings = new Schema({
    mediation: {
        cdr_dir: String
    },
    bills: {
        pdf_dir: String,
        csv_dir: String
    }
});
