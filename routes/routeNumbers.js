module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var Number = require('../models/numberSchema')(db);
    
    app.get('/numberpage/:id?', function(req, res){
        var update = req.session.update;
        var id = req.params.id;
        if(id){
            Number.find({account: id},
                        function(err, nums){
                            if(err){
                                req.session.update = {
                                    type: "Warning",
                                    message: "There was a problem querying the number collection",
                                    raw_err: err
                                }
                            }
                            res.render('numberview', {
	                        ctx: {
                                    title: "pyGreedy - Numbers",
	                            nums: nums,
                                    update: update
                                }
                            });
                        });
            return;
        }
        res.render('numberview', {
	    ctx: {
                title: "pyGreedy - Numbers",
	        nums: null,
                update: update
            }
        });
        delete req.session.update;
    });
    
    app.get('/numdestroy/:id', function(req, res){
        var update = req.query.update;
        Number.findById(req.params.id, function(err, num){
            if(err){
                req.session.update = {
                    type: "Warning",
                    message: "Cannot find this number in db.",
                    raw_err: err
                }
            }
	    num.remove(function(err, num){
                if(err){
                    req.session.update = {
                        type: "Error",
                        message: "There was a problem deleting the number",
                        raw_err: err
                    }
                }else{
                    req.session.update = {
                        type: "Info",
                        message: num.number + " removed!",
                        raw_err: err
                    }
                }
                res.redirect('/numberpage/'+num.account);
	    });
        });
        delete req.query.update;
    });

    app.post('/numbercreate', function(req, res){
        var NumberList = [];
        var number = req.body.number;
        if(/[a-z]/i.test(number)){
            req.session.update = {
                type: "Warning",
                message: "There was a problem deleting the user",
                raw_err: err
            }
            res.redirect('/numberpage/'+number.account);
        }
        if(number.indexOf("-") > -1){
	    number = number.split("-");
	    /* create start and end number range from request */
	    var sNumber = number[0];
	    var eNumber = sNumber.substring(0, sNumber.length - number[1].length);
	    eNumber = eNumber.concat(number[1]);
	    var i = sNumber;
	    /* make array of objects */
	    while(i <= eNumber){
	        /* has to be a plain object not Number */
	        NumberList.push({
		    number: (i++).toString(),
		    account: req.body.account
	        });
	    }
	    
        }else{
            NumberList.push({
                number: req.body.number,
                account: req.body.account
            });
        }

        /* and bulk insert */
	Number.collection.insert(NumberList, function(err){
	    if(err){
		req.session.update = {
                    type: "Error",
                    message: "There was a problem with inserting the range",
                    raw_err: err
                }
                res.redirect('/numberpage/');
	    }else{
                req.session.update = {
                    type: "Info",
                    message: "Numbers added",
                }
	        res.redirect('/numberpage/'+req.body.account);
            }
	});
    });
    
    app.post('/numfind', function(req, res){
        var update = null;
        Number.find({
	    $or: [{number: new RegExp(req.body.search, "i")}, {account: req.body.search}]
        },function(err, nums){
	    if(err){
	        update = {
                    type: "Warning",
                    message: "Cannot find it",
                    raw_err: err
                }
	    }
            res.render('numberview', {
	        ctx: {
                    title: "pyGreedy - Numbers",
	            nums: nums,
                    update: update
                }
            });
        });
    });
}
