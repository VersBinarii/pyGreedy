module.exports = function(db){
    return db.model('BillingProc', BillingProcSchema());
}


function BillingProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        
        running: Boolean,
        pdf_dir: {
            type: String, default: "./pdf_out"
        },
        csv_dir: {
            type: String, default: "./csv_out"
        },
        log_dir: {
            type: String,
            default: "/var/log/pyGreedy/billing.log"
        }
    });
}
