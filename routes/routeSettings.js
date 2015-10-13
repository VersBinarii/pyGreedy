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
	    ratingProc,
            update = req.session.update;

	BillingProc.find({}, function(err, _bp){
	    if(err){
                update = eh.set_error("Could not read BillingProc db",
                                                  err);
                return;
            }
            
            billingProc = checkAndInit(_bp, new BillingProc());
            
            MediationProc.find({}, function(err, _mp){
	        if(err){
                    update = eh.set_error("Could not read MediationProc db",
                                                      err);
                    return;
                }
                mediationProc = checkAndInit( _mp, new MediationProc());
                
                RatingProc.find({}, function(err, _rp){
	            if(err){
                        update = eh.set_error("Could not read RatingProc db",
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
                            update: update
                        }
                    });
	        });
	    });
	});
        delete req.session.update;
    });


    app.post('/update_mediation_proc/:id', function(req, res){
        MediationProc.findById(req.params.id, function(err, med_proc){
            if(err){
                req.session.update = eh.set_error("Error fetching MediationProcess DB",
                                                  err);
                return res.redirect('/settings');
            }
            med_proc.binary_dir = req.body.m_bin_dir;
            med_proc.cdr_dir = req.body.m_cdr_dir;
            med_proc.frequency = req.body.m_frequency;
            med_proc.log_dir = req.body.m_log_dir;
            med_proc.save(function(err){
                if(err){
                    req.session.update = eh.set_error("Error updating MediationProcess",
                                                  err);
                }else{
                    req.session.update = eh.set_info("MediationProcess updated");
                }
                res.redirect('/settings');
            });
        });
    });

    
    app.post('/update_billing_proc/:id', function(req, res){
        BillingProc.findById(req.params.id, function(err, bill_proc){
            if(err){
                req.session.update = eh.set_error("Error fetching BillingProcess DB",
                                                  err);
                return res.redirect('/settings');
            }
            bill_proc.binary_dir = req.body.b_bin_dir;
            bill_proc.pdf_dir = req.body.b_pdf_dir;
            bill_proc.csv_dir = req.body.b_csv_dir;
            bill_proc.log_dir = req.body.b_log_dir;
            bill_proc.save(function(err){
                if(err){
                    req.session.update = eh.set_error("Error updating BillingProcess",
                                                  err);
                }else{
                    req.session.update = eh.set_info("BillingProcess updated");
                }
                res.redirect('/settings');
            });
        });
    });

    
    app.post('/update_rating_proc/:id', function(req, res){
        RatingProc.findById(req.params.id, function(err, rating_proc){
            if(err){
                req.session.update = eh.set_error("Error fetching RatingProcess DB",
                                                  err);
                return res.redirect('/settings');
            }
            rating_proc.binary_dir = req.body.r_bin_dir;
            rating_proc.log_dir = req.body.r_log_dir;
            rating_proc.save(function(err){
                if(err){
                    req.session.update = eh.set_error("Error updating RatingProcess",
                                                  err);
                }else{
                    req.session.update = eh.set_info("RatingProcess updated");
                }
                res.redirect('/settings');
            });
        });
    });
    
    function checkAndInit(arr, init){
        if(arr.length > 0){
            console.log("Not default");
            return arr;
        }else{
            var a = [];
            init.save();
            a[0] = init;
            return a;
        }
    }
}
