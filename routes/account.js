'use strict';

var _ = require('underscore');
var eh = require('../lib/errorHelper');

module.exports = function(app, comms){    

    var db = comms.db;
    
    app.get('/accounts', function (req, res){

        db.tx(function(){
            return this.batch([
                this.many("SELECT * FROM account ORDER BY name;"),
                this.many("SELECT name FROM ratesheet;")
            ]);
        }).then(function(result){
            res.render('accounts', {
                ctx: {
                    title: 'Accounts',
                    accounts: result[0],
                    ratesheets: result[1]
                }
            });
        }, handleError);
    });

    app.get('/accountdestroy/:id', function (req, res){
        db.none("DELETE FROM account WHERE accid=$1", req.params.id)
            .then(function () {
                res.redirect('/accounts');
            })
            .catch(handleError);
    });

    app.get('/accountedit/:id', function(req, res){
        var update = req.session.update;

        db.tx(function(){
            var q1 = this.one("SELECT * FROM account WHERE accid=$1", req.params.id);
            var q2 = this.manyOrNone("SELECT name FROM ratesheet WHERE type='R';");
            var q3 = this.manyOrNone("SELECT name FROM ratesheet WHERE type='D';");

            return this.batch([q1, q2, q3]);
        }).then(function(result){
            res.render('accountedit', {
		ctx: {
                    title: 'pyGreedy - Account Edit',
		    acc : result[0],
		    ratesheets: result[1],
		    discounts: result[2],
                    update: update
                }
	    });
        }, handleError);
        //then clear the session so its displayed only once
        delete req.session.update;
    });
    
    app.post('/accountcreate', function(req, res){
        var Account = {
	    accid : req.body.id,
	    name : req.body.name,
	    sapid : req.body.sapid,
	    identifier : req.body.identifier,
	    ratesheet : req.body.ratesheet
        };
        
        db.none("INSERT INTO account(accid,name,sapid,identifier,ratesheet) VALUES($1, $2, $3, $4, $5)",
                _.values(Account))
            .then(function () {
                res.redirect('/accountedit/'+Account.accid);
            })
            .catch(handleError);
    });
    
    app.post('/accountupdate/:id', function(req, res){

        var Account = {
            accid : req.params.id,
	    name : req.body.name,
	    sapid : req.body.sapid,
	    identifier : req.body.identifier,
	    ratesheet : req.body.ratesheet,
	    discount : req.body.discount,
            parent_company : req.body.parentcompany,
            vat : req.body.vat,
            address1 : req.body.address1,
            address2 : req.body.address2,
            address3 : req.body.address3,
            address4 : req.body.address4,
            address5 : req.body.address5
        }
        console.log(Account);
        db.none("UPDATE account SET name=${name},sapid=${sapid},"+
                "identifier=${identifier},ratesheet=${ratesheet},discount=${discount},"+
                "parent_company=${parent_company},vat=${vat},address1=${address1},"+
                "address2=${address2},address3=${address3},address4=${address4},"+
                "address5=${address5},edited=NOW() WHERE accid=${accid}", Account)
            .then(function(result){
                res.redirect('/accountedit/'+Account.accid);
            })
            .catch(handleError);
    });
}

function handleError(err){
    console.log(err);
}
