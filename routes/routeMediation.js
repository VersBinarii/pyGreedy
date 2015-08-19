module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var MediatedCall = require('../models/mediationSchema')(db);

    app.get('/mediation', function(req, res){
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
    });
    app.post('/mediation_show/:perpage/:numpage', function(req, res){
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
            .find(
                query, {},
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
    });
    
    app.post('/mediation_update/:perpage/:numpage/:id/:sdate/:edate/:valid', function(req, res){

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
                req.params.id,
                {
                    account_id: req.body.accountid,
                    calltype: req.body.calltype,
                    valid: req.body.valid,
                    note: req.body.note
                }, function(err, mc){
                    if(err){
                        console.log(err)
                    }
                    MediatedCall
                        .find(
                            query, {},
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
    });
    
    app.get('/mediation_page/:perpage/:numpage/:sdate/:edate/:valid', function(req, res){
        
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
            .find(
                query, {},
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
    });
}
