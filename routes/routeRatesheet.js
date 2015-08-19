module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var RatesheetList = require('../models/ratesheetSchema')(db);

    app.get('/ratesheetpage', function(req, res){
        
        RatesheetList.find({}, 'name', {sort: {name: -1}}, function (err, ratesheets){
	    res.render('ratesheetview', {
	        title: "pyGreedy - Ratesheet",
	        ratesheets: ratesheets
	    });
        });  
    });
    
    app.post('/rsshow', function(req, res){
        RatesheetList
            .findOne({name: req.body.ratesheet })
            .populate({ path: 'rs'})
            .exec(function(err, ratesheet){
                RatesheetList
                    .populate(
                        ratesheet,
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
    });
    app.post('/rscreate', function(req, res){
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
    });
    app.post('/rsaddrate/:id', function(req, res){
        
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
            .findByIdAndUpdate(
                req.params.id,
		{$push: {'rs': rs}},
		{safe: true, new: true},
		function(err, ratesheet){
		    RatesheetList
                        .populate(
                            ratesheet,
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
    });
    app.get('/rsdelrate/:id', function(req, res){
        
        var id = req.params.id.split(":");
        RatesheetList
            .findByIdAndUpdate(
                id[0],
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
    });
    app.post('/rsdelratesheet', function(req, res){

        RatesheetList.findById(req.body.rsid, function(err, rsl){
	    rsl.remove( function(err, rsl){
	        res.redirect('/ratesheetpage');
	    });
        });
    });
}
