'use strict'

module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var RatesheetList = require('../models/ratesheetSchema')(db);
    var Zone = mongoose.model('Zone');

    app.get('/ratesheetpage', function(req, res){
        var update = req.session.update;
        RatesheetList.find({}, 'name', {sort: {name: -1}}, function (err, ratesheets){
            if(err){
                req.session.update = eh.set_error("Problem accessing mongodb",
                                                  err);
            }
            res.render('ratesheetview', {
                ctx: {
                    title: "pyGreedy - Ratesheet",
                    ratesheets: ratesheets,
                    update: update
                }
            });
        });
        delete req.session.update;
    });

    app.post('/rsshow', function(req, res){
        RatesheetList
            .findById(req.body.ratesheet)
            .populate({ path: 'rs'})
            .exec(function(err, ratesheet){
                if(err){
                    req.session.update = eh.set_error("Problem accessing mongodb",
                                                      err);
                }
                RatesheetList
                    .populate(
                        ratesheet,
                        {path: 'rs.zone', model: 'Zone'},
                        function(err, ratesheet){
                            if(err){
                                req.session.update = eh.set_error("Problem accessing mongodb",
                                                                  err);
                            }
                            Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
                                if(err){
                                    req.session.update = eh.set_error("Problem accessing mongodb",
                                                                      err);
                                }
                                res.render('ratesheetedit', {
                                    ctx: {
                                        title: "pyGreedy - Ratesheet Edit",
                                        ratesheet : ratesheet,
                                        zones: zones,
                                        update: req.session.update
                                    }
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
        }).save(function(err, rsl){
            if(err){
                req.session.update = eh.set_error("Failed to created ratesheet",
                                                      err);
            }else{
                req.session.update = eh.set_info("Ratesheet \""+rsl.name+"\" created");
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
                    if(err){
                        req.session.update = eh.set_error("Failed to query Ratesheetlist",
                                                      err);
                    }
                    RatesheetList
                        .populate(
                            ratesheet,
                            {path: 'rs.zone', model: 'Zone'},
                            function(err, ratesheet){
                                if(err){
                                    req.session.update = eh.set_error("Failed to query Ratesheetlist",
                                                                      err);
                                }
                                Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
                                    if(err){
                                        req.session.update = eh.set_error("Failed to query Zone collection.",
                                                                          err);
                                    }else{
                                        req.session.update = eh.set_info("Rate added");
                                    }
                                    res.render('ratesheetedit', {
                                        ctx: {
                                            title: "pyGreedy - Ratesheet Edit",
                                            ratesheet : ratesheet,
                                            zones: zones
                                        }
                                    });
                                });
                            });
                });
    });
    app.get('/rsdelrate/:rsid/:rid', function(req, res){
        RatesheetList
            .findByIdAndUpdate(
                req.params.rsid,
                {$pull: {'rs': {'_id': req.params.rid}}},
                {safe: true, new: true},
                function(err, ratesheet){
                    if(err){
                        req.session.update = eh.set_error("Failed to query Ratesheet collection",
                                                          err);
                    }
                    RatesheetList
                        .populate(ratesheet,
                                  {path: 'rs.zone', model: 'Zone'},
                                  function(err, ratesheet){
                                      if(err){
                                          req.session.update = eh.set_error("Failed to query Ratesheet collection",
                                                                            err);
                                      }
                                      Zone.find({}, 'name', {sort: {name: 'asc'}}, function(err, zones){
                                          if(err){
                                              req.session.update = eh.set_error("Failed to query Zones collection",
                                                                                err);
                                          }else{
                                              req.session.update = eh.set_info("Rate removed");
                                          }
                                          res.render('ratesheetedit', {
                                              ctx:{
                                                  title: "pyGreedy - Ratesheet Edit",
                                                  ratesheet : ratesheet,
                                                  zones: zones,
                                                  update: req.session.update
                                              }
                                          });
                                      });
                                  });
                });
    });
    app.post('/rsdelratesheet', function(req, res){
        RatesheetList.findById(req.body.rsid, function(err, rsl){
            if(err){
                req.session.update = eh.set_error("Could not find ratesheet",
                                                  err);
                return res.redirect('/ratesheetpage');
            }
            rsl.remove( function(err, rsl){
                if(err){
                    req.session.update = eh.set_error("Failed to remove the rate",
                                                      err);
                }else{
                    req.session.update = eh.set_info("Ratesheet \""+rsl.name+"\" deleted succesfully");
                }
                res.redirect('/ratesheetpage');
            });
        });
    });
}
