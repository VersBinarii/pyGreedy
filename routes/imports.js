'use strict';

var multer  = require('multer')
var upload = multer({ dest: './uploads/' });
var lr = require('line-reader');
var _ = require('underscore');
var eh = require('../lib/errorHelper');

module.exports = function(app, comms){    
    
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
            import_ratesheet(comms, req);
            break;
        case 'numbers':
            import_numbers(comms, req);
            break;

        case 'account':
            import_account(comms, req);
            break;

        case 'region':
            import_regions(comms, req);
            break;

        case 'zone':
            import_zones(comms, req);
            break;
        }
    });
}

function import_regions(c, req){
    var success = 0,
        header = 0;
    
    lr.eachLine(req.file.path, function(line, last){
        if(req.body.header === 'on' &&
           header == 0){
            c.io.emit("message.update", "Skipping header");
            header++;
        }else{
            var csv = line.split(',');
            if(csv.length == 2){
                c.db.none("INSERT INTO region(regionid,name) values($1,$2)",
                          [csv[0], csv[1]])
                    .then(function(){
                        success++;
                        if(last) {
                            c.io.emit("message.update", "Imported "+success+" regions");
                        }
                    })
                    .catch(function(err){
                        c.io.emit('message.error', "Inserting "+csv[1]+" failed");
                        c.io.emit('message.error', "Error: "+err);
                    });
            }else{
                c.io.emit("message.update", "Malformed line "+ line);
            }
        }
    });
}

function import_zones(c, req){
    var success = 0,
        header = 0;
    
    lr.eachLine(req.file.path, function(line, last){
        if(req.body.header === 'on' &&
           header == 0){
            c.io.emit("message.update", "Skipping header");
            header++;
        }else{
            var csv = line.split(',');
            if(csv.length == 3){
                c.db.none("INSERT INTO zone(zoneid, name, regionid) values($1,$2,$3)",
                          [csv[0], csv[1], csv[2]])
                    .then(function(){
                        success++;                        
                        if(last) {
                            c.io.emit("message.update", "Imported "+success+" zones");
                        }
                    })
                    .catch(function(err){
                        c.io.emit('message.error', "Inserting "+csv[1]+" failed");
                    });
            }else{
                c.io.emit("message.update", "Malformed line "+ line);
                c.io.emit('message.error', "Error: "+err);
            }
        }
    });
}

function import_account(c, req){   
    var success = 0,
        header = 0;
    
    lr.eachLine(req.file.path, function(line, last){
        
        if(req.body.header === 'on' &&
           header == 0){
            c.io.emit("message.update", "Skipping header");
            header++;
        }else{
            var csv = line.split(',');
            if(csv.length == 13){
                var Account = {
                    accid: csv[0], name: csv[1],
                    sapid: csv[2],   identifier: csv[6],
                    ratesheet: csv[4], discount: csv[3],
                    parentcompany: csv[5], vat: csv[7],
                    building: csv[8], street: csv[12],
                    city: csv[9], postcode: csv[11],
                    county: csv[10]
                };
                
                c.db.none("INSERT INTO account(accid,name,sapid,identifier,ratesheet,discount,"+
                          "parent_company,vat,address1,address2,address3,address4,address5) "+
                          "values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", _.values(Account))
                    .then(function(){
                        success++;
                        if(last) {
                            c.io.emit("message.update", "Imported "+success+" accounts");
                            c.io.emit("message.update", "Account import finished");
                        }
                    })
                    .catch(function(err){
                        c.io.emit('message.error', "Inserting "+csv[1]+" failed");
                        c.io.emit('message.error', "Error: "+err);
                    });
            }else{
                c.io.emit("message.update", "Malformed line "+ line+ "\nSkipping...");
            }
        }                
    });      
}

function import_ratesheet(c, req){
    var header = 0,
        success = 0;
    
    var rst = {
        name: req.file.originalname.split('.')[0],
        rstype: req.body.rstype
    }
    // OK so first create Ratesheet
    var sco;
    var queries = [];
    c.db.connect()
        .then(function(obj){
            sco = obj;
            return sco.one("INSERT INTO ratesheet(name, type) values($1,$2) RETURNING ratesheetid",
                           _.values(rst));
        })
        .then(function(ratesheet){
            return sco.tx(function(t){
                lr.eachLine(req.file.path, function(line, last){
                    if(req.body.header === 'on' &&
                       header == 0){
                        c.io.emit("message.update", "Skipping header");
                        header++;
                    }else{         
                        var csv = line.split(',');
                        if(csv.length == 8){
                            var rs = {
                                cc: csv[0], number: csv[1],
                                flatcharge: csv[2], peak: csv[3],
                                offpeak: csv[4], wknd: csv[5],
                                rate_type: csv[6], zoneid: csv[7],
                                ratesheetid: ratesheet.ratesheetid
                            };
                            queries.push(
                                t.none("INSERT INTO rate(cc,number,flat_rate,peak,offpeak,weekend,"+
                                       "ratetype,zoneid,ratesheetid) "+
                                       "values($1,$2,$3,$4,$5,$6,$7,$8,$9)", _.values(rs))
                            );
                        }else{
                            c.io.emit("message.update", "Malformed line "+ line+ "\nSkipping...");
                        }
                    }
                    success++;
                    if(last){
                        c.io.emit("message.update", success+" lines parsed, inserting to db");
                        return t.batch(queries);
                    }
                });
            });
        })
        .catch(function(err){
            c.io.emit('message.error', "Inserting rate for "+csv[1]+" failed");
            c.io.emit('message.error', "Error: "+err);
            c.db.none("DELETE FROM ratesheet WHERE ratesheetid=$1", rs.ratesheetid)
                .then(function(){
                    
                })
                .catch(function(err){
                    c.io.emit('message.error', "Failed to rollback the ratesheet");
                });
        })
            .finally(function(){
                if(sco){
                    c.io.emit("message.update", "Ratesheet import finished");
                    sco.done();
                }
            });                    
}

function import_numbers(c, req){
    var success = 0,
        header = 0; 
    
    lr.eachLine(req.file.path, function(line, last){
        
        if(req.body.header === 'on' &&
           header == 0){
            c.io.emit("message.update", "Skipping header");
            header++;
        }else{
            var csv = line.split(',');
            if(csv.length === 2){
                c.db("INSERT INTO numbers(number, accid) values($1,$2)", [csv[0], csv[1]])
                    .then(function(){
                        success++;
                        if(last) {
                            c.io.emit("message.update", "Imported "+success+" numbers");
                        }
                    })
                    .catch(function(err){
                        c.io.emit('message.error', "Inserting "+csv[0]+" failed");
                        c.io.emit('message.error', "Error: "+err);
                    });
            }else{
                c.io.emit("message.error", "Skipping malformed entry on line: "+linecount);
            }
        }
    });
}
