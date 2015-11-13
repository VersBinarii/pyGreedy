'use strict';

var eh = require('../lib/errorHelper')
var _ = require('underscore')

module.exports = function(app, comm){
    var db = comm.db

    app.get('/extracharges/:accid', function(req, res){
        
        var accid = req.params.accid;
        
        db.tx(function(){
            return this.batch([
                this.manyOrNone("SELECT * FROM extracharges WHERE accid=$1", accid),
                this.one("SELECT accid,name FROM account WHERE accid=$1", accid)
            ])
        })
            .then(function(result){
                res.render('extracharges', {
                    ctx: {
                        title: "Extracharges",
                        xcharges: result[0],
                        account: result[1],
                        update: req.session.update
                    }
                })
            })
            .catch(handleError);
    });
    
    app.post('/extrachargeadd', function(req, res){

        var xcharge = {
            description: req.body.description,
            details: req.body.details,
            code: req.body.code,
            qty: req.body.qty,
            charge: req.body.charge,
            recurring: req.body.recurring,
            period: new Date(),
            accid: req.body.account
        }

        db.none("INSERT INTO "+
                "extracharges(description,details,code,qty,charge,recurring,period,accid) "+
                "VALUES($1,$2,$3,$4,$5,$6,$7,$8)", _.values(xcharge))
            .then(function(){
                res.redirect('/extracharges/'+req.body.account)
            })
            .catch(handleError);
    })

    app.get('/extrachargedelete/:chid/:accid', function(req, res){
        var xchid = req.params.chid
        var accid = req.params.accid

        db.none("DELETE FROM extracharges WHERE extrachargeid=$1", xchid)
            .then(function(){
                res.redirect('/extracharges/'+accid);
            })
            .catch(handleError);
    })
}

var handleError = function(err){
    console.log(err)
}
