module.exports = function(db){
    return db.model('Settings', SettingsSchema());
}


function SettingsSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        billing_process: {
            running: Boolean,
            pdf_dir: {
                type: String, default: "./pdf_out"
            },
            csv_dir: {
                type: String, default: "./csv_out"
            }
        },
        mediation_process: {
            running: Boolean,
            cdr_dir: {
                type: String, default: "./cdr_in"
            },
            frequency: {
                type: Number, default: "24"
            },
        },
        rating_process: {
            running: Boolean
        }
    });
}
