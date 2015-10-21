module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var multer  = require('multer')
    var upload = multer({ dest: './uploads/' });
    var linereader = require('line-reader');
    
    app.get('/imports', function(req, res){
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
            console.log(req.body.import);
            import_ratesheet(linereader, req, function(err){
                if(err){
                    req.session.update = eh.set_error("Failure parsing the "+
                                                      req.file.originalname, err);
                }else{
                    req.session.update = eh.set_info("Ratesheet imported succesfully");
                }
                res.redirect('/imports');
            });
            break;
        case 'numbers':
            import_numbers(linereader, req, function(err){
                if(err){
                    req.session.update = eh.set_error("Failure parsing the "+
                                                      req.file.originalname, err);
                }else{
                    req.session.update = eh.set_info("Ratesheet imported succesfully");
                }
                res.redirect('/imports');
            });
            break;

        case 'account':
            import_account(linereader, req, function(err){
                if(err){
                    console.log("Fail");
                    console.log(err);
                    req.session.update = eh.set_error("Failure parsing the "+
                                                      req.file.originalname, err);
                }else{
                    console.log("success");
                    req.session.update = eh.set_info("Accounts imported succesfully");
                }
                console.log("redirect");
                res.redirect('/imports');
            });
            break;
        }
    });

    function import_numbers(lr, req, cb){
        var Number = mongoose.model('Number');
        var linecount = 0;

        lr.eachLine(req.file.path, function(line, last){

            if(req.body.header === 'on' &&
               linecount == 0){
                
            }else{
                var csv = line.split(',');
                if(csv.length === 2){
                    new Number({
                        number: csv[0],
                        account: csv[1]
                    }).save(function(err){
                        if(err){
                            console.log("Malformed line "+ line+ "\nSkipping...");
                        }
                    });
                }else{
                    console.log("Malformed line "+ line+ "\nSkipping...");
                }
            }
            
            linecount++;
            if(last) return cb(null);
        });
    }
    
    function import_account(lr, req, cb){
        var Account = mongoose.model('Account');
        var linecount = 0;
        
        lr.eachLine(req.file.path, function(line, last){

            if(req.body.header === 'on' &&
                   linecount == 0){
                    
            }else{
                var csv = line.split(',');
                if(csv.length === 13){
                    console.log("CSV length: "+csv.length);
                    new Account({
                        id: csv[0], name: csv[1],
                        sapid: csv[2], discount: csv[3],
                        ratesheet: csv[4],
                        parentcompany: csv[5],
                        identifier: csv[6], vat: csv[7],
                        building: csv[8], city: csv[9],
                        county: csv[10], postcode: csv[11],
                        street: csv[12]
                    }).save(function(err){
                        if(err){
                            console.log("Malformed line "+ line+ "\nSkipping...");
                        }
                    });
                }else{
                    console.log("Malformed line "+ line+ "\nSkipping...");
                }
            }

            linecount++;
            if(last) return cb(null);
        });
        
    }
    
    function import_ratesheet(lr, req, cb){
        
        var Ratesheet = mongoose.model('Ratesheet');
        var Zone = mongoose.model('Zone');
        var linecount = 0;

        // OK so first create Ratesheet
        new Ratesheet({
            name: req.file.originalname.split('.')[0],
            rstype: req.body.rstype,
            rs: []
        }).save(function(err, rsheet){

            if(err) return cb(err);

            // then start reading the uploaded file
            lr.eachLine(req.file.path, function(line, last){
                
                if(req.body.header === 'on' &&
                   linecount == 0){
                    
                }else{         
                    var csv = line.split(',');
                    
                    // find the needed zone
                    Zone.findOne({zone_id: csv[7]}, function(err, z){
                        
                        if(err) return cb(err);
                        
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
                        rsheet.update(
                            {$push: {'rs': rs}},
                            {safe: true, new: true},
                            function(err){
                                if(err) return cb(err);
                            });
                    });         
                }     
                linecount++;
                if(last) return cb(null);
            });
        });
    }  
}
    
