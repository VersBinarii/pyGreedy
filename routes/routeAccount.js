module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var Account = require('../models/accountSchema')(db);
    var RatesheetList = mongoose.model('RatesheetList');
    
    app.get('/accountpage', function (req, res){
        var update = req.session.update;
        Account.find(function(err, accounts){
            if(err){
                res.render('/errors/500', {
                    message: "There was a problem querying Account collection",
                    error: err
                });
                return;
            }
	    RatesheetList.find({}, 'name', function (err, ratesheets){
                if(err){
                    res.render('/errors/500', {
                        message: "There was a problem querying Ratesheet collection",
                        error: err
                    });
                    return;
                }
                res.render('accountview', {
                    ctx: {
                        title: "pyGreedy - Account",
		        accounts: accounts,
		        ratesheets: ratesheets,
                        update: update
                    }
	        });
	    });
        });
        // then clear the update so its isplayed only once
        delete req.session.update;
    });
 
    app.get('/accdestroy/:id', function (req, res ){
        Account.findById(req.params.id, function(err, acc){
            if(err){
                req.session.update = {
                    type: "Warning",
                    message: "Cannot find this user in DB",
                    raw_err: err
                }
            }
	    acc.remove(function(err, acc){
                if(err){
                    req.session.update = {
                        type: "Warning",
                        message: "There was a problem deleting the user",
                        raw_err: err
                    }
                }else{
                    req.session.update = {
                        type: "Info",
                        message: "User successfully deleted"
                    }
                }
	        res.redirect('/accountpage');
	    });
        });
    });

    app.get('/accedit/:id', function(req, res){
        var update = req.session.update;
        Account.findById(req.params.id, function(err, acc){
            if(err){
                res.render('/errors/500', {
                    message: "There was a problem querying Account collection",
                    error: err
                });
                return;
            }
	    RatesheetList.find({rstype: 'ratesheet'},function (err, ratesheets){
                if(err){
                    res.render('/errors/500', {
                        message: "There was a problem querying Ratesheet collection",
                        error: err
                    });
                    return;
                }
	        RatesheetList.find({rstype: 'discount'}, function (err, discounts){
                    if(err){
                        res.render('/errors/500', {
                            message: "There was a problem querying for discounts",
                            error: err
                        });
                        return;
                    }
		    res.render('accedit', {
		        ctx: {
                            title: 'pyGreedy - Account Edit',
		            acc : acc,
		            ratesheets: ratesheets,
		            discounts: discounts,
                            update: update
                        }
		    });
	        });
	    });
        });
        //then clear the session so its displayed only once
        delete req.session.update;
    });
    
    app.post('/acccreate', function(req, res){
        new Account({
	    id : req.body.id,
	    name : req.body.name,
	    sapid : req.body.sapid,
	    trunk : req.body.trunk,
	    ratesheet : req.body.ratesheet,
	    discount: "",
	    created : Date.now(),
	    updated : Date.now()
        }).save(function(err){
            if(err){
                req.session.update = {
                    type: "Error",
                    message: "There was a problem adding account"
                }
            }
            else{
                req.session.update = {
                    type: "Info",
                    message: "Account added"
                }
            }
	    res.redirect('/accountpage');
        });
    });
    
    app.post('/accupdate/:id', function(req, res){
        Account.findById(req.params.id, function(err, acc){
            if(err){
                req.session.update = {
                    type: "Error",
                    message: "There was a problem accessing the account data"
                }
            }
            
	    acc.name = req.body.name;
	    acc.sapid = req.body.sapid;
	    acc.trunk = req.body.trunk;
	    acc.ratesheet = req.body.ratesheet;
	    acc.discount = req.body.discount;
	    acc.updated = Date.now();
	    acc.save(function(err, acc){
                if(err){
                    req.session.update = {
                        type: "Error",
                        message: "There was a problem updating account"
                    }
                }else{
                    req.session.update = {
                        type: "Info",
                        message: "Account updated"
                    }
                }
	        res.redirect('/accedit/'+acc._id);
	    });
        });
    });
}
