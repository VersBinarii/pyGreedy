module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var multer  = require('multer')
    var upload = multer({ dest: './uploads/' });
    var linereader = require('line-reader');
    var io = dbstuff.io;
    
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
            import_ratesheet(linereader, req);
            break;
        case 'numbers':
            import_numbers(linereader, req);
            break;

        case 'account':
            import_account(linereader, req);
            break;
        }
    });

    function import_numbers(lr, req){
        var Number = mongoose.model('Number');
        var linecount = 0,
            success = 0;

        lr.eachLine(req.file.path, function(line, last){

            if(req.body.header === 'on' &&
               linecount == 0){
                io.emit("message.update", "Skipping header");
                
            }else{
                var csv = line.split(',');
                if(csv.length === 2){
                    new Number({
                        number: csv[0],
                        account: csv[1]
                    }).save(function(err){
                        if(err){
                            io.emit("message.error", "Number "+csv[0]+" already in database");
                        }else{
                            success++;
                        }
                    });
                }else{
                    io.emit("message.error", "Skipping malformed entry on line: "+linecount);
                }
            }
            
            linecount++;
            if(last) {
                io.emit("message.update", "Imported "+success+ " numbers");
                io.emit("message.update", "Parsing finished");
                return;
            }
        });
    }
    
    function import_account(lr, req){
        var Account = mongoose.model('Account');
        var linecount = 0,
            success = 0;
        
        lr.eachLine(req.file.path, function(line, last){

            if(req.body.header === 'on' &&
               linecount == 0){
                 io.emit("message.update", "Skipping header");       
            }else{
                var csv = line.split(',');
                if(csv.length === 13){
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
                            io.emit("message.update", "Malformed line "+ line+ "\nSkipping...");
                        }else{
                            success++;
                        }
                    });
                }else{
                    io.emit("message.update", "Malformed line "+ line+ "\nSkipping...");
                }
            }

            linecount++;
            if(last) {
                io.emit("message.update", "Imported "+success+" accounts");
                io.emit("message.update", "Account import finished");
                return;
            }
        });
        
    }
    
    function import_ratesheet(lr, req){
        
        var Ratesheet = mongoose.model('Ratesheet');
        var Zone = mongoose.model('Zone');
        var linecount = 0,
            success = 0;

        // OK so first create Ratesheet
        new Ratesheet({
            name: req.file.originalname.split('.')[0],
            rstype: req.body.rstype,
            rs: []
        }).save(function(err, rsheet){

            if(err){
                io.emit('message.error', "Could not create Ratesheet");
                return;
            }
            // then start reading the uploaded file
            lr.eachLine(req.file.path, function(line, last){
                
                if(req.body.header === 'on' &&
                   linecount == 0){
                    io.emit("message.update", "Skipping header");
                }else{         
                    var csv = line.split(',');
                    
                    // find the needed zone
                    Zone.findOne({zone_id: csv[7]}, function(err, z){
                        
                        io.emit('message.error',
                                "Could not find the Zone with ID: "+
                                csv[7]+" on line: "+linecount);
                        
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
                                if(err){
                                    io.emit('message.error', "Failed to add rate to the list");
                                }else{
                                    success++;
                                }
                            });
                    });         
                }     
                linecount++;
                if(last){
                    io.emit('message.update', "Imported "+success+" rates");
                    io.emit('message.update', "Ratesheet created");
                    return;
                }
            });
        });
    }  
}
    
