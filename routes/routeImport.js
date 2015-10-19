module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var multer  = require('multer')
    var upload = multer({ dest: './uploads/' });
    var linereader = require('line-reader');
    
    app.get('/imports', function(req, res){
        console.log(req.session.dick);
        res.render('import', {
            ctx: {
                title: "pyGreedy - Imports",
                update: req.session.update
            }
        });
        
    });
    
    app.post('/import_csv', upload.single('csv_file'), function(req, res, next){

        switch(req.body.import){

        case 'ratesheet':
            import_ratesheet(linereader, req, function(err){
                if(err){
                    console.log(err);
                    req.session.update = eh.set_error("Failure parsing the .csv file", err);
                }else{
                    req.session.update = eh.set_info("Import completed");
                }
                res.redirect('/imports');
            });
            break;
        case 'numbers':
            break;
        case 'account':
            import_account(linereader, req, function(err){

            });
            break;
        }
    });


    
    function import_account(lr, req, cb){

    }
    
    function import_ratesheet(lr, req, cb){
        
        var Ratesheet = mongoose.model('Ratesheet');
        var Zone = mongoose.model('Zone');
        var linecount = 0;

        //Fucking async!
        // OK so first create Ratesheet
        new Ratesheet({
            name: req.file.originalname,
            rstype: req.body.rstype,
            rs: []
        }).save(function(err, rsheet){

            if(err){
                console.log("returning on error 1");
                return cb( err );
            }
            console.log("But still going?");
            // then start reading the uploaded file
            lr.eachLine(req.file.path, function(line){
                
                if(req.body.header === 'on' &&
                   linecount == 0){
                    
                }else{         
                    var csv = line.split(',');
                    // find the needed zone
                    Zone.findOne({zone_id: csv[7]}, function(err, z){
                        
                        if(err){
                            console.log("returning on error 2");
                            return cb( err );
                        }
                        console.log("Nah still going");
                        var rs = {
                            cc: csv[0],
                            number: csv[1],
                            flatcharge: csv[2],
                            peak: csv[3],
                            offpeak: csv[4],
                            wknd: csv[5],
                            rate_type: csv[6],
                            zone: z._id
                        };

                        // and update the ratesheet
                        rsheet
                            .update(
                                {$push: {'rs': rs}},
                                {safe: true, new: true},
                                function(err){
                                    if(err){
                                        console.log("returning on last error");
                                        return cb( err );
                                    }
                                });
                    });         
                }     
                linecount++;
            });
            console.log("Final return");
            return cb(null);
        });
    }  
}
    
