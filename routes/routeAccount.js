module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var Account = require('../models/accountSchema')(db);
    var RatesheetList = mongoose.model('RatesheetList');
    
    app.get('/accountpage', function (req, res){
        Account.find(function(err, accounts, count ){
	    RatesheetList.find({}, 'name', function (err, ratesheets){
	        res.render('accountview', {
		    title: "pyGreedy - Account",
		    accounts: accounts,
		    ratesheets: ratesheets
	        });
	    });
        });
    });
 
    app.get('/accdestroy/:id', function (req, res ){
        Account.findById(req.params.id, function(err, acc){
	    acc.remove( function(err, acc){
	        res.redirect('/accountpage');
	    });
        });
    });

    app.get('/accedit/:id', function(req, res){
        Account.findById(req.params.id, function(err, account){
	    RatesheetList.find({rstype: 'ratesheet'},function (err, ratesheets){
	        RatesheetList.find({rstype: 'discount'}, function (err, discounts){
		    res.render('accedit', {
		        title: 'pyGreedy - Account Edit',
		        account : account,
		        ratesheets: ratesheets,
		        discounts: discounts
		    });
	        });
	    });
        });
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
	    res.redirect('/accountpage');
        });
    });
    
    app.post('/accupdate/:id', function(req, res){
        Account.findById(req.params.id, function(err, acc){
	    acc.name = req.body.name;
	    acc.sapid = req.body.sapid;
	    acc.trunk = req.body.trunk;
	    acc.ratesheet = req.body.ratesheet;
	    acc.discount = req.body.discount;
	    acc.updated = Date.now();
	    acc.save(function(err, acc, count){
	        res.redirect('/accountpage');
	    });
        });
    });
    
}
