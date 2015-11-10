'use strict';

module.exports = function(app, dbstuff){
    
    app.get('/rating', function(req, res){
        Account.find({}, "name id", {sort: { name: 'asc'}}, function(err, accounts){
            res.render('rating_main', {
	        ctx:{
                    title: "pyGreedy - Rating",
                    accounts: accounts
                }
            });
        });
    });
}
