module.exports = function(db){
    return db.model('MediationProc', MediationProcSchema());
}


function MediationProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
	
        running: Boolean,
        cdr_dir: {
            type: String, default: "./cdr_in"
        },
        frequency: {
            type: Number, default: "24"
        },
	log_dir: {
            type: String,
            default: "/var/log/pyGreedy/mediation.log"
        }
    });
}
