'use strict'
var eh = require('../lib/errorHelper');

module.exports = function(app, comms){
    var db = comms.db;
    
    app.get('/numbers/:id?', function(req, res){
        var update = req.session.update;
        var id = req.params.id;

        db.manyOrNone("SELECT * FROM numbers WHERE accid=$1", (id ? id : ""))
            .then(function(nums){
                res.render('numbers', {
                    ctx : {
                        title: "pyGreedy - Numbers",
	                nums: nums,
                        update: update
                    }
                });
            })
            .catch(handleError);
        delete req.session.update;
    });
    
    app.get('/numberdestroy/:number/:accid', function(req, res){
        db.none("DELETE FROM numbers WHERE accid=$1 and number=$2", [req.params.accid, req.params.number])
            .then(function(){
                req.session.update = eh.set_info("Number deleted");
                res.redirect('/numbers/'+req.params.accid);
            })
            .catch(handleError);
    });

    app.post('/numbercreate', function(req, res){
        var numbers = [];
        var number = req.body.number;
        if(/[a-z]/i.test(number)){
            req.session.update = eh.set_error("Not a number", err);
            res.redirect('/numbers');
        }
        console.log("Account: "+req.body.account);
        db.tx(function(t){
            if(number.indexOf("-") > -1){
	        number = number.split("-");
	        /* create start and end number range from request */
	        var eNumber = number[0].substring(0, number[0].length - number[1].length);
	        eNumber = eNumber.concat(number[1]);
	        var i = number[0];
	        /* make array of objects */
	        while(i <= eNumber){
	            /* has to be a plain object not Number */
	            numbers.push(t.none("INSERT INTO numbers(number, accid) values($1,$2)",
                                           [(i++).toString(), req.body.account]));
                }
            }else{
                numbers.push(t.none("INSERT INTO numbers(number, accid) values($1,$2)",
                                       [number, req.body.account]));
            }
            return t.batch(numbers);
        })
            .then(function(){
                req.session.update = eh.set_info("Numbers added");
	        res.redirect('/numbers/'+req.body.account);
            })
            .catch(handleError);
    });
    
    app.post('/numberfind', function(req, res){
        db.query("SELECT * FROM numbers WHERE number=$1 OR accid=$1", req.body.search)
            .then(function(nums){
                res.render('numbers', {
	            ctx: {
                        title: "pyGreedy - Numbers",
	                nums: nums
                    }
                });
            })
            .catch(handleError);
    });
}


var handleError = function(err){
    console.log(err);
}
