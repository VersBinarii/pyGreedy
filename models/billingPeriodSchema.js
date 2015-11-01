var months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/*
  This will be applicable to the Rating and Billing where 
  large periods of time need to be processed

  It wont be applicable to Mediation since we might want 
  to run mediation in higher frequency i.e weekly, daily, hourly?
*/

module.exports = function(db){
    return db.model('BillingPeriod', BillingPeriodSchema());
}

function BillingPeriodSchema(){
    var Schema = require('mongoose').Schema;
    var d = new Date();
    
    return new Schema({
        name: {
            type: String, default: "Billing_Period_"+months[d.getMonth()]+"_"+d.getYear()
        },
        files: [{
            type: String
        }],
        done: {
            type: Boolean
        }
    });
}
