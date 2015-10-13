module.exports = function(db){
    return db.model('RatingProc', RatingProcSchema());
}


function RatingProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
       
        running: Boolean,
        binary_dir: {
            type: String, default: "~/pyGreedy/bin/rating.py"
        },
        log_dir: {
            type: String,
            default: "/var/log/pyGreedy/rating.log"
        }
    });
}
