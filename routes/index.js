var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Number = mongoose.model('Number');
var RatesheetList = mongoose.model('RatesheetList');

    
/* GET home page */
exports.index = function(req, res){
    res.render('index', {
	title: "pyGreedy"
    });
};

exports.accountpage = function(req, res){
    Account.find(function(err, accounts, count ){
	RatesheetList.find({}, 'name', function (err, ratesheets){
	    res.render('accountview', {
		title: "pyGreedy",
		accounts: accounts,
		ratesheets: ratesheets
	    });
	});
    });
};

/* POST for creation */
exports.acccreate = function(req, res){
    new Account({
	id : req.body.id,
	name : req.body.name,
	sapid : req.body.sapid,
	trunk : req.body.trunk,
	ratesheet : req.body.ratesheet,
	created : Date.now(),
	updated : Date.now()
    }).save(function(err, account, count){
	res.redirect('/accountpage');
    });
};

/* GET destroy */
exports.accdestroy = function(req, res ){
    Account.findById(req.params.id, function(err, acc){
	acc.remove( function(err, acc){
	    res.redirect('/accountpage');
	});
    });
};

/* GET edit */
exports.accedit = function(req, res){
    Account.findById(req.params.id, function(err, account){
	RatesheetList.find(function (err, ratesheets){
	    res.render('accedit', {
		title: 'pyGreedy',
		account : account,
		ratesheets: ratesheets
	    });
	});
    });
};

/* POST update */
exports.accupdate = function(req, res){
    Account.findById(req.params.id, function(err, acc){
	acc.name = req.body.name;
	acc.sapid = req.body.sapid;
	acc.trunk = req.body.trunk;
	acc.ratesheet = req.body.ratesheet;
	acc.updated = Date.now();
	acc.save(function(err, acc, count){
	    res.redirect('/accountpage');
	});
    });
};

/*
  ###############  Number Schema functions ################
*/
    
exports.numpage = function(req, res){
    res.render('numberview', {
	title: "pyGreedy",
	numbers: null
    });
};

/* POST for creation */
exports.numcreate = function(req, res){
    new Number({
	number: req.body.number,
	account : req.body.account,
	created : Date.now(),
	updated : Date.now()
    }).save(function(err, number, count){
	res.redirect('/numberpage');
    });
};

/*
  find by number or by account
*/
exports.numfind = function(req, res){
    Number.find({
	$or: [{number: new RegExp(req.body.search, 'i')}, {account: req.body.search}]
    },function(err, num, count){
	res.render('numberview', {
	    title: "pyGreedy",
	    numbers: num
	});
    });
};

/* GET destroy */
exports.numdestroy = function(req, res ){
    Number.findById(req.params.id, function(err, num){
	num.remove( function(err, num){
	    res.redirect('/numberpage');
	});
    });
};


/*
  ###############  Ratesheet Schema functions ################
*/

/* GET for main ratesheet page */
exports.rspage = function(req, res){
    
    RatesheetList.find({}, 'name', function (err, ratesheets){
	res.render('ratesheetview', {
	    title: "pyGreedy",
	    ratesheets: ratesheets
	});
    });  
};

/* POST to create a new ratesheet */
exports.rscreate = function(req, res){
    new RatesheetList({
	name : req.body.rsname,
	rs: []
    }).save(function(err, rsl, count){
	res.redirect('/ratesheetpage');
    });
};

/* POST to redirect to view where new destination rates can be set or deleted */
exports.rsshow = function(req, res){
    RatesheetList.findOne({name: req.body.ratesheet },function(err, ratesheet, count){
	res.render('ratesheetedit', {
	    title: "pyGreedy",
	    ratesheet : ratesheet
	});
    });
};

exports.rsaddrate = function(req, res){
    var rs = {
	cc: req.body.cc,
	number: req.body.number,
	zone: req.body.zone,
	rate_type: req.body.ratetype,
	peak: req.body.peak,
	offpeak: req.body.offpeak,
	wknd: req.body.wknd,
	flatcharge: req.body.flat
    };

    RatesheetList.findByIdAndUpdate(req.params.id,
				    {$push: {'rs': rs}},
				    {safe: true, new: true},
				    function(err, ratesheet){
					res.render('ratesheetedit', {
					    title: "pyGreedy",
					    ratesheet : ratesheet
					});
				    });
};

exports.rsdelrate = function(req, res){
    
    var id = req.params.id.split(":");
    RatesheetList.findByIdAndUpdate(id[0],
				    {$pull: {'rs': {'_id': id[1]}}},
				    {safe: true, new: true},
				    function(err, ratesheet){
					console.log(id[0]);
					console.log(id[1]);
					console.log(err);
					console.log(ratesheet);
					res.render('ratesheetedit', {
					    title: "pyGreedy",
					    ratesheet : ratesheet
					});
				    });
};
