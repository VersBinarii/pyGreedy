'use strict';

module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    
    app.get('/mediation', function(req, res){
        var _update = req.session.update;

        /* lets set some default settings */
        var _state = {
            sdate: "",
            edate: "",
            numpage: 1,
            perpage: 50,
            valid: "all"
        };
        
        /* if session exists use it */
        if(req.session.state){
            _state = req.session.state;
        }
        
        /* create the query */
        var query = {
            'call_date': {
                '$gte': new Date(_state.sdate), '$lt': new Date(_state.edate)
            }
        };
        
        if(_state.valid != "all"){
            query.valid = _state.valid;
        }
        
        MediatedCall
            .find(query, {},
                {skip: (_state.numpage-1)*_state.perpage, limit: _state.perpage, sort: {call_date: 'asc'}},
                function(err, mc){
                    if(err){
                        _update = eh.set_error("Failed to query Mediatedcall collection",
                                               err);
                    }
                    res.render('mediation', {
	                ctx: {
                            title: "pyGreedy - Mediated calls",
	                    mediatedcalls: mc,
                            state:{
	                        perpage: _state.perpage,
	                        numpage: _state.numpage,
                                sdate: _state.sdate,
                                edate: _state.edate,
                                valid: _state.valid
                            },
                            update: _update
                        }
                    });
                });
        delete req.session.update;
    });
    
    app.post('/mediation_show/:perpage/:numpage', function(req, res){
        
        req.session.state = {
            perpage: req.params.perpage,
            numpage: req.params.numpage,
            valid: req.body.valid,
            sdate: req.body.sdate,
            edate: req.body.edate
            
        }
        res.redirect('/mediation');
    });
    
    app.post('/mediation_update/:perpage/:numpage/:id/:sdate/:edate/:valid', function(req, res){

        req.session.state = {
            perpage: req.params.perpage,
            numpage: req.params.numpage,
            valid: req.params.valid,
            sdate: req.params.sdate,
            edate: req.params.edate
            
        }

        /* update and the display */
        MediatedCall
            .findByIdAndUpdate(
                req.params.id,
                {
                    account_id: req.body.accountid,
                    calltype: req.body.calltype,
                    valid: req.body.valid,
                    note: req.body.note
                }, function(err){
                    if(err){
                        req.session.update = eh.set_error("Failed to update the entry",
                                                          err);
                    }
                    res.redirect('/mediation');
                   
                });
    });
    
    app.get('/mediation_page/:perpage/:numpage/:sdate/:edate/:valid', function(req, res){

        /* just update the paging */
        req.session.state = {
            perpage: req.params.perpage,
            numpage: req.params.numpage,
            valid: req.params.valid,
            sdate: req.params.sdate,
            edate: req.params.edate
            
        }
        
        res.redirect('/mediation');
    });
}
