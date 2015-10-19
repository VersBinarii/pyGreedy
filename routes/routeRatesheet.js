'use strict'

module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var Ratesheet = require('../models/ratesheetSchema')(db);
    var Zone = mongoose.model('Zone');

    app.get('/ratesheets', function(req, res){
        var update = req.session.update;
        Ratesheet.find({}, 'name', {sort: {name: -1}}, function (err, ratesheets){
            if(err){
                update = eh.set_error("Problem accessing mongodb",
                                                  err);
            }
            res.render('ratesheets', {
                ctx: {
                    title: "pyGreedy - Ratesheets",
                    ratesheets: ratesheets,
                    update: update
                }
            });
        });
        delete req.session.update;
    });

    app.get('/ratesheetedit/:rsid', function(req, res){
        Ratesheet
            .findById(req.params.rsid)
            .populate({ path: 'rs'})
            .exec(function(err, ratesheet){
                if(err){
                    req.session.update = eh.set_error("Problem accessing mongodb",
                                                      err);
                }
                Ratesheet
                    .populate(ratesheet, {path: 'rs.zone', model: 'Zone'},
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
                                      res.render('ratesheet', {
                                          ctx: {
                                              title: "pyGreedy - "+ratesheet.name,
                                              ratesheet : ratesheet,
                                              zones: zones,
                                              update: req.session.update
                                          }
                                      });
                                  });
                              });
            });
    });

    app.post('/ratesheetedit', function(req, res){
        res.redirect('/ratesheetedit/'+req.body.ratesheet);
    });
    
    app.post('/ratesheetcreate', function(req, res){
        new Ratesheet({
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
            res.redirect('/ratesheets');
        });
    });
    
    app.post('/ratesheetaddrate/:rsid', function(req, res){

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

        Ratesheet
            .findByIdAndUpdate(
                req.params.rsid,
                {$push: {'rs': rs}},
                {safe: true, new: true},
                function(err){
                    if(err){
                        req.session.update = eh.set_error("Failed to query Ratesheetlist",
                                                      err);
                    }
                    res.redirect('/ratesheetedit/'+req.params.rsid);           
                });
    });
    
    app.get('/ratesheetdelrate/:rsid/:rid', function(req, res){
        Ratesheet
            .findByIdAndUpdate(
                req.params.rsid,
                {$pull: {'rs': {'_id': req.params.rid}}},
                {safe: true, new: true},
                function(err, ratesheet){
                    if(err){
                        req.session.update = eh.set_error("Failed to query Ratesheet collection",
                                                          err);
                    }else{
                        req.session.update = eh.set_info("Rate succesfully removed");
                    }
                    res.redirect('/ratesheetedit/'+req.params.rsid);                    
                });
    });
    
    app.post('/ratesheetdelete', function(req, res){
        Ratesheet.findById(req.body.rsid, function(err, rsl){
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
                res.redirect('/ratesheets');
            });
        });
    });
}
