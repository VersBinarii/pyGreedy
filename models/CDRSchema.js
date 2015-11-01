module.exports = function(db){
    return db.model('ParsedCDRs', ParsedCDRSchema());
}

function ParsedCDRSchema(){
    var Schema = require('mongoose').Schema;

    return new Schema({
        filename: {
            /* will need to have additional index on the filename */
            type: String, required: true, index: true
        },
        finished: {
            type: Boolean, required: true
        },
        line: {
            type: Number, required: true
        }
    });
}
