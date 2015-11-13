'use strict';
var eh = require('../lib/errorHelper')
var _ = require('underscore')

module.exports = function(app, comm){
    var db = comm.db
    
    app.get('/ratesheets', function(req, res){
        var update = req.session.update

        db.manyOrNone("SELECT ratesheetid,name FROM ratesheet ORDER BY name;")
            .then(function(result){
                res.render('ratesheets', {
                    ctx: {
                        title: "pyGreedy - Ratesheets",
                        ratesheets: result,
                        update: update
                    }
                });
            })
            .catch(handleError);
        
        delete req.session.update;
    });

    app.get('/ratesheetedit/:rsid', function(req, res){

        var ratesheetid = req.params.rsid
        db.tx(function(){
            return this.batch([
                this.oneOrNone("SELECT * FROM ratesheet WHERE ratesheetid=$1", ratesheetid),
                this.manyOrNone("SELECT * FROM rate r1, zone z1 "+
                                "WHERE ratesheetid=$1 AND r1.zoneid = z1.zoneid "+
                                "ORDER BY number", ratesheetid),
                this.manyOrNone("SELECT * FROM zone ORDER BY name;")
            ])
        })
            .then(function(result){
                res.render('ratesheet', {
                    ctx: {
                        title: "pyGreedy - "+result[0].name,
                        ratesheet : result[0],
                        rates: result[1],
                        zones: result[2],
                        update: req.session.update
                    }
                });
            })
            .catch(handleError);
        
    })

    app.post('/ratesheetedit', function(req, res){
        res.redirect('/ratesheetedit/'+req.body.ratesheet);
    });
    
    app.post('/ratesheetcreate', function(req, res){
        var rs = {
            name : req.body.rsname,
            type: req.body.ratesheettype
        }

        db.none("INSERT INTO ratesheet(name,type) VALUES($1,$2)",[rs.name, rs.type])
            .then(function(){
                res.redirect('/ratesheets');
            })
            .catch(handleError);
    })
    
    app.post('/ratesheetaddrate/:rsid', function(req, res){

        var rs = {
            cc: req.body.cc,
            number: req.body.number,
            flat_rate: req.body.flat,
            peak: req.body.peak,
            offpeak: req.body.offpeak,
            weekend: req.body.wknd,
            ratetype: req.body.ratetype,
            zoneid: req.body.zone,
            ratesheetid: req.params.rsid
        }

        db.none("INSERT INTO "+
                "rate(cc,number,flat_rate,peak,offpeak,weekend,ratetype,zoneid,ratesheetid) "+
                "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);", _.values(rs))
            .then(function(){
                res.redirect('/ratesheetedit/'+rs.ratesheetid);           
            })
            .catch(handleError);
    })
    
    app.get('/ratesheetdelrate/:rsid/:rid', function(req, res){

        db.none("DELETE FROM rate WHERE rateid=$1", req.params.rid)
            .then(function(){
                res.redirect('/ratesheetedit/'+req.params.rsid);                    
            })
            .catch(handleError);

    })
    
    app.post('/ratesheetdelete', function(req, res){
        
        db.none("DELETE FROM ratesheet WHERE ratesheetid=$1",req.body.rsid)
            .then(function(){
                res.redirect('/ratesheets');
            })
            .catch(handleError);
    })
}

var handleError = function(err){
    console.log(err)
}
