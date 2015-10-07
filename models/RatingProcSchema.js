module.exports = function(db){
    return db.model('RatingProc', RatingProcSchema());
}


function RatingProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
       
        running: Boolean,
        log_dir: {
            type: String,
            default: "/var/log/pyGreedy/rating.log"
        }
    });
}
