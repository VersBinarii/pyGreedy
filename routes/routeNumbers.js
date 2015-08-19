module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    var Number = require('../models/numberSchema')(db);
    
    app.get('/numberpage', function(req, res){
        res.render('numberview', {
	    title: "pyGreedy - Numbers",
	    numbers: null
        });
    });
    app.get('/numdestroy/:id/:last', function(req, res ){
        Number.findById(req.params.id, function(err, num){
	    num.remove( function(err, num){
	        /* repeat original query */
	        Number.find({
		    $or: [{number: new RegExp(req.params.last, 'i')}, {account: req.params.last}]
	        },function(err, num, count){
		    res.render('numberview', {
		        title: "pyGreedy - Numbers",
		        numbers: num,
		        lastsearch: req.params.last
		    });
	        });
	    });
        });
    });

    app.post('/numbercreate', function(req, res){
        var NumberList = [];
        var arg = req.body.number;
        if(arg.indexOf("-") > -1){
	    arg = arg.split("-");
	    /* create start and end number range from request */
	    var sNumber = arg[0];
	    var eNumber = sNumber.substring(0, sNumber.length - arg[1].length);
	    eNumber = eNumber.concat(arg[1]);
	    var i = sNumber;
	    /* make array of objects */
	    while(i <= eNumber){
	        /* has to be a plain object not Number */
	        NumberList.push({
		    number: (i++).toString(),
		    account: req.body.account
	        });
	    }
	    /* and bulk insert */
	    Number.collection.insert(NumberList, function(err, num){
	        if(err){
		    console.log(err);
	        }
	        Number.find({account: req.body.account},function(err, num, count){
		    res.render('numberview', {
		        title: "pyGreedy - Numbers",
		        numbers: num,
		        lastsearch: req.body.account
		    });
	        });
	    });
        }else{
	    new Number({
	        number: req.body.number,
	        account : req.body.account
	    }).save(function(err, number, count){
	        Number.find({account: req.body.account},function(err, num, count){
		    res.render('numberview', {
		        title: "pyGreedy - Numbers",
		        numbers: num,
		        lastsearch: req.body.account
		    });
	        });
	    });
        }
    });
    app.post('/numfind', function(req, res){
        Number.find({
	    $or: [{number: new RegExp(req.body.search, "i")}, {account: req.body.search}]
        },function(err, num, count){
	    if(err){
	        console.log(err);
	    }
	    res.render('numberview', {
	        title: "pyGreedy - Numbers",
	        numbers: num,
	        lastsearch: req.body.search
	    });
        });
    });
}
