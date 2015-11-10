'use strict';

module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    
    app.get('/extracharges/:accid', function(req, res){

        var accid = req.params.accid;
        console.log("Account: "+accid);
        
        Account.findById(accid)
            .populate({path: 'extracharge'})
            .exec(function(err, account){
                console.log(account);
                res.render('extracharges', {
                    ctx: {
                        title: "Extracharges",
                        account: account,
                        update: req.session.update
                    }
                });
            });
    });
    
    app.post('/extrachargeadd', function(req, res){
        console.log("Adding for: "+req.body.account);
        new ExtraCharge({
            description: req.body.description,
            details: req.body.details,
            code: req.body.code,
            qty: req.body.qty,
            charge: req.body.charge,
            recurring: req.body.recurring
        }).save(function(err, charge){
            if(err){
                console.log(err);
                req.session.update = eh.set_error("Problem adding charge", err);
                res.redirect('/extracharges/'+req.body.account);
            }else{
                Account
                    .findByIdAndUpdate(
                        req.body.account,
                        {$push: {'extracharge': charge._id}},
                        function(err){
                            if(err){
                                console.log(err);
                                req.session.update = eh.set_error(
                                    "Problem adding charge", err);
                            }
                            res.redirect('/extracharges/'+req.body.account);
                        });
            }
        });
    });

    app.get('/extrachargedelete/:chid/:accid', function(req, res){
        Account
            .findByIdAndUpdate(
                req.params.accid,
                {$pull: {'extracharge': req.params.chid}},
                function(err){
                    if(err){
                        console.log(err);
                        req.session.update = eh.set_error(
                            "Problem deleting charge", err);
                        res.redirect('/extracharges/'+req.params.accid);
                    }else{
                        ExtraCharge
                            .findById(
                                req.params.chid,
                                function(err, ech){
                                    if(err){
                                        console.log(err);
                                        req.session.update = eh.set_error(
                                            "Problem accessing DB", err);
                                    }else{
                                        ech.remove(function(err){
                                            if(err){
                                                req.session.update = eh.set_error(
                                                    "Failed to remove the charge", err);
                                            }else{
                                                req.session.update = eh.set_info(
                                                    "Charge \""+ech.description+"\" deleted succesfully");
                                            }
                                            res.redirect('/extracharges/'+req.params.accid);
                                        });
                                    }
                                    
                                });
                    }
                });
    });
}
