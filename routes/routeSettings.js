module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var BillingProc = require('../models/BillingProcSchema')(db);
    var MediationProc = require('../models/MediationProcSchema')(db);
    var RatingProc = require('../models/RatingProcSchema')(db);

    app.get('/settings', function(req, res){

        var billingProc,
	    mediationProc,
	    ratingProc;

	BillingProc.find({}, function(err, _bp){
	    if(err){
                req.session.update = eh.set_error("Could not read BillingProc db",
                                                  err);
                return;
            }
            
            billingProc = checkAndInit(_bp, new BillingProc());
            
            MediationProc.find({}, function(err, _mp){
	        if(err){
                    req.session.update = eh.set_error("Could not read MediationProc db",
                                                      err);
                    return;
                }
                mediationProc = checkAndInit( _mp, new MediationProc());
                
                RatingProc.find({}, function(err, _rp){
	            if(err){
                        req.session.update = eh.set_error("Could not read RatingProc db",
                                                          err);
                        return;
                    }
                    ratingProc = checkAndInit(_rp, new RatingProc());

                    console.log(ratingProc);
                    console.log(mediationProc);
                    console.log(billingProc);
                    res.render('settings', {
                        ctx: {
                            title: "pyGreedy - Settings",
                            BP: billingProc,
                            MP: mediationProc,
                            RP: ratingProc,
                            update: req.session.update
                        }
                    });
	        });
	    });
	});
        delete req.session.update;
    });

    function checkAndInit(arr, init){
        if(arr.length > 0){
            return arr;
        }else{
            var a = [];
            a[0] = init;
            return a;
        }
    }
}
