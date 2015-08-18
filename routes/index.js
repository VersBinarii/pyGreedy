var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Number = mongoose.model('Number');
var RatesheetList = mongoose.model('RatesheetList');
var Zone = mongoose.model('Zone');
var Region = mongoose.model('Region');
var MediatedCall = mongoose.model('MediatedCall');

/* GET home page */
exports.index = function(req, res){
    res.render('index', {
	title: "pyGreedy"
    });
};

exports.acc_mainpage = function(req, res){
    Account.find(function(err, accounts, count ){
	RatesheetList.find({}, 'name', function (err, ratesheets){
	    res.render('accountview', {
		title: "pyGreedy - Account",
		accounts: accounts,
		ratesheets: ratesheets
	    });
	});
    });
};

/* POST for creation */
exports.acc_create = function(req, res){
    new Account({
	id : req.body.id,
	name : req.body.name,
	sapid : req.body.sapid,
	trunk : req.body.trunk,
	ratesheet : req.body.ratesheet,
	discount: "",
	created : Date.now(),
	updated : Date.now()
    }).save(function(err, account, count){
	res.redirect('/accountpage');
    });
};

/* GET destroy */
exports.acc_destroy = function(req, res ){
    Account.findById(req.params.id, function(err, acc){
	acc.remove( function(err, acc){
	    res.redirect('/accountpage');
	});
    });
};

/* GET edit */
exports.acc_edit = function(req, res){
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
};

/* POST update */
exports.acc_update = function(req, res){
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
};

/*
  ###############  Number Schema functions ################
*/
    
exports.num_mainpage = function(req, res){
    res.render('numberview', {
	title: "pyGreedy - Numbers",
	numbers: null
    });
};

/* POST for creation */
exports.num_create = function(req, res){
    var NumberList = [];
    var arg = req.body.number;
    if(arg.indexOf("-") > -1){
	arg = arg.split("-");
	/* create start and end number range from request */
	var sNumber = arg[0];
	var eNumber = sNumber.substring(0, sNumber.length - arg[1].length);
	eNumber = eNumber.concat(arg[1]);
	var i = sNumber;
	/* make array of objects */
	while(i <= eNumber){
	    /* has to be a plain object not Number */
	    NumberList.push({
		number: (i++).toString(),
		account: req.body.account
	    });
	}
	/* and bulk insert */
	Number.collection.insert(NumberList, function(err, num){
	    if(err){
		console.log(err);
	    }
	    Number.find({account: req.body.account},function(err, num, count){
		res.render('numberview', {
		    title: "pyGreedy - Numbers",
		    numbers: num,
		    lastsearch: req.body.account
		});
	    });
	});
    }else{
	new Number({
	    number: req.body.number,
	    account : req.body.account
	}).save(function(err, number, count){
	    Number.find({account: req.body.account},function(err, num, count){
		res.render('numberview', {
		    title: "pyGreedy - Numbers",
		    numbers: num,
		    lastsearch: req.body.account
		});
	    });
	});
    }
};

/*
  find by number or by account
*/
exports.num_find = function(req, res){
    Number.find({
	$or: [{number: new RegExp(req.body.search, "i")}, {account: req.body.search}]
    },function(err, num, count){
	if(err){
	    console.log(err);
	}
	res.render('numberview', {
	    title: "pyGreedy - Numbers",
	    numbers: num,
	    lastsearch: req.body.search
	});
    });
};

/* GET destroy */
exports.num_destroy = function(req, res ){
    Number.findById(req.params.id, function(err, num){
	num.remove( function(err, num){
	    /* repeat original query */
	    Number.find({
		$or: [{number: new RegExp(req.params.last, 'i')}, {account: req.params.last}]
	    },function(err, num, count){
		res.render('numberview', {
		    title: "pyGreedy - Numbers",
		    numbers: num,
		    lastsearch: req.params.last
		});
	    });
	});
    });
};


/*
  ###############  Ratesheet Schema functions ################
*/

/* GET for main ratesheet page */
exports.rs_mainpage = function(req, res){
    
    RatesheetList.find({}, 'name', {sort: {name: -1}}, function (err, ratesheets){
	res.render('ratesheetview', {
	    title: "pyGreedy - Ratesheet",
	    ratesheets: ratesheets
	});
    });  
};

/* POST to create a new ratesheet */
exports.rs_rscreate = function(req, res){
    new RatesheetList({
	name : req.body.rsname,
	rstype: req.body.ratesheettype,
	rs: []
    }).save(function(err, rsl, count){
	if(err){
	    console.log(err);
	}
	res.redirect('/ratesheetpage');
    });
};

/* POST to redirect to view where new destination rates can be set or deleted */
exports.rs_rsshow = function(req, res){
    RatesheetList.findOne({name: req.body.ratesheet })
        .populate({ path: 'rs'})
        .exec(function(err, ratesheet){
            RatesheetList.populate(ratesheet,
                                   {path: 'rs.zone', model: 'Zone'},
                                   function(err, ratesheet){
                                       Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
	                                   res.render('ratesheetedit', {
	                                       title: "pyGreedy - Ratesheet Edit",
	                                       ratesheet : ratesheet,
                                               zones: zones
                                           });
	                               });
                                   });
        });
};

exports.rs_addrate = function(req, res){
    
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
    
    RatesheetList
        .findByIdAndUpdate(req.params.id,
			   {$push: {'rs': rs}},
			   {safe: true, new: true},
			   function(err, ratesheet){
			       RatesheetList
                                   .populate(ratesheet,
                                             {path: 'rs.zone', model: 'Zone'},
                                             function(err, ratesheet){
                                                 Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
	                                             res.render('ratesheetedit', {
	                                                 title: "pyGreedy - Ratesheet Edit",
	                                                 ratesheet : ratesheet,
                                                         zones: zones
                                                     });
	                                         });
                                             });
			   });
};

exports.rs_delrate = function(req, res){
    
    var id = req.params.id.split(":");
    RatesheetList
        .findByIdAndUpdate(id[0],
			   {$pull: {'rs': {'_id': id[1]}}},
			   {safe: true, new: true},
			   function(err, ratesheet){
			       RatesheetList
                                   .populate(ratesheet,
                                             {path: 'rs.zone', model: 'Zone'},
                                             function(err, ratesheet){
                                                 Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
	                                             res.render('ratesheetedit', {
	                                                 title: "pyGreedy - Ratesheet Edit",
	                                                 ratesheet : ratesheet,
                                                         zones: zones
                                                     });
	                                         });
                                             });
				    });
};


exports.rs_delratesheet = function(req, res){

    RatesheetList.findById(req.body.rsid, function(err, rsl){
	rsl.remove( function(err, rsl){
	    res.redirect('/ratesheetpage');
	});
    });
};

/*
############# Zone/Region handling ######################
*/

exports.zone_view = function(req, res){
    Zone.find({}, function(err, zones){
	Region.find({}, function(err, regions){
	    res.render('zoneview', {
		title: "pyGreedy - Regions/Zones",
		zones: zones,
		regions: regions
	    });
	}); 
    });
}

exports.zone_create = function(req, res){
    new Zone({
	zone_id: req.body.zoneid,
	name: req.body.zonename,
	region: req.body.regionid
    }).save(function(err, zone){
	res.redirect('/zoneview');
    });
};

exports.zone_update = function(req, res){
    Zone.findById(req.params.id, function(err, zone){
	zone.zone_id = req.body.zoneid;
	zone.name = req.body.zonename;
	zone.region = req.body.regionid;
	zone.save(function(err, zone){
	    res.redirect('/zoneview');
	});
    });
};

exports.zone_destroy = function(req, res){
    Zone.findById(req.params.id,function(err, zone){
	zone.remove(function(err, zone){
	    res.redirect('/zoneview');
	});
    });
};

exports.region_create = function(req, res){
    new Region({
	region_id: req.body.regionid,
	name: req.body.regionname,
    }).save(function(err, region){
	res.redirect('/zoneview');
    });
};

exports.region_update = function(req, res){
    Region.findById(req.params.id,function(err, region){
	region.region_id = req.body.regionid;
	region.name = req.body.regionname;
	region.save(function(err, region){
	    res.redirect('/zoneview');
	});
    });
};

exports.region_destroy = function(req, res){
    Region.findById(req.params.id,function(err, region){
	region.remove(function(err, reg){
	    res.redirect('/zoneview');
	});
    });
};


/* ############### mediation #################*/

exports.mediation_main = function(req, res){
    res.render('mediation', {
	title: "pyGreedy - Mediation",
	mediatedcalls: [],
        state:{
	    perpage: 50,
	    numpage: 1,
            sdate: "",
            edate: "",
            valid: "all"
        }
    });
};

exports.mediation_show = function(req, res){
    var numpage = req.params.numpage
    var perpage = req.params.perpage
    var query = {
        'call_date': {
            '$gte': new Date(req.body.sdate), '$lt': new Date(req.body.edate)
        }
    };
    
    if(req.body.valid != "all"){
        query.valid = req.body.valid;
    }
    
    MediatedCall
        .find(query, {},
              {skip: (numpage-1)*perpage, limit: perpage, sort: {call_date: 'asc'}},
              function(err, mc){
                  if(err){
                      console.log(err)
                  }
                  res.render('mediation', {
	              title: "pyGreedy - Mediated calls",
	              mediatedcalls: mc,
                      state:{
	                  perpage: perpage,
	                  numpage: numpage,
                          sdate: req.body.sdate,
                          edate: req.body.edate,
                          valid: req.body.valid
                      }
                  });
              });
};

exports.mediation_update = function(req, res){

    var perpage = req.params.perpage
    var numpage = req.params.numpage
    var query = {
        'call_date': {
            '$gte': new Date(req.params.sdate), '$lt': new Date(req.params.edate)
        }
    };
    
    if(req.params.valid != "all"){
        query.valid = req.params.valid
    }
    
    MediatedCall
        .findByIdAndUpdate(
            req.params.id, {
                account_id: req.body.accountid,
                calltype: req.body.calltype,
                valid: req.body.valid,
                note: req.body.note
            }, function(err, mc){
                if(err){
                    console.log(err)
                }
                MediatedCall
                    .find(query, {},
                          {skip: (numpage-1) * perpage, limit: perpage, sort: {call_date: 'asc'}},
                          function(err, mc){
                              if(err){
                                  console.log(err)
                              }
                              res.render('mediation', {
	                          title: "pyGreedy - Mediated calls",
	                          mediatedcalls: mc,
                                  state: {
	                              perpage: perpage,
	                              numpage: numpage,
                                      sdate: req.params.sdate,
                                      edate: req.params.edate,
                                      valid: req.params.valid
                                  }
                              });
                          });
            });
};

exports.mediation_page = function(req, res){

    var perpage = req.params.perpage
    var numpage = req.params.numpage
    var query = {
            'call_date': {
                '$gte': new Date(req.params.sdate), '$lt': new Date(req.params.edate)
            }
    };

    if(req.params.valid != "all"){
        query.valid = req.params.valid
    }
    
    MediatedCall.find(query, {},
                      {
                          skip: (numpage-1) * perpage,
                          limit: perpage,
                          sort: {call_date: 'asc'}
                      }, function(err, mc){
                          if(err){
                              console.log(err)
                          }
                          res.render('mediation', {
	                      title: "pyGreedy - Mediated calls",
	                      mediatedcalls: mc,
                              state: {
	                          perpage: perpage,
	                          numpage: numpage,
                                  sdate: req.params.sdate,
                                  edate: req.params.edate,
                                  valid: req.params.valid
                              }
                          });
                      });
};
/* ############## calls ################## */

exports.rating_mainpage = function(req, res){
    Account.find({}, "name id", {sort: { name: 'asc'}}, function(err, accounts){
        res.render('rating_main', {
	    title: "pyGreedy - Rating",
            accounts: accounts
        });
    });
};


/* ################# PDF stuff ############## */
exports.user_bill = function(req, res){
    res.render('customer_pdf');
};
