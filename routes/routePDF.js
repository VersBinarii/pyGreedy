/*
  TEST
*/

module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;

    //var pdf = require('./lib/pdf.js');
    app.get('/user_bill/:acc_id/:sdate/:edate', function(req, res){
        res.render('customer_pdf');
    });
}
//pdf.html_to_pdf('http://localhost:3000/user_bill/50dsdd/2015-07-01/2015-07-30/', "htm_test.pdf");
