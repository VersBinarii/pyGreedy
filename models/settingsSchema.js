module.exports = function(db){
    return db.model('Settings', SettingsSchema());
}


SettingsSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        mediation: {
            cdr_dir: String
        },
        bills: {
            pdf_dir: String,
            csv_dir: String
        }
    });
}
