module.exports = function(db){
    return db.model('MediationProc', MediationProcSchema());
}


function MediationProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
	
        running: Boolean,
        name: {
            type: String, unique: true, default: "Mediation Process"
        },
        binary_dir: {
            type: String, default: "~/pyGreedy/bin/mediation.py"
        },
        cdr_dir: {
            type: String, default: "~/pyGreedy/cdr_in"
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
