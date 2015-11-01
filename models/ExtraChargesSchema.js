module.exports = function(db){
    return db.model('Extracharge', ExtraChargesSchema());
}

function ExtraChargesSchema(){
    var Schema = require('mongoose').Schema;

    return new Schema({
      
        description: {
            type: String
        },
        details: {
            type: String
        },
        code: {
            type: String, required: true
        },
        qty: {
            type: Number, required: true
        },
        charge: {
            type: Number, required: true
        },
        recurring: {
            type: Boolean, required: true, default: true
        },
        date: {
            type: Date, default: Date.now()
        }
    });
}
