'use strict';

module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var io = dbstuff.io;
    var CMD = require("../lib/CMD");
    var eh = require('../lib/errorHelper');
    var MediationProc = mongoose.model('MediationProc');

    /*
      Main Mediation control page
     */
    app.get('/mediation_control', function(req, res){
        MediationProc.find({}, function(err, med_proc){
            if(err){
                req.session.update = er.set_error("Failed to query database", err);
            }
            
            res.render('mediation_proc_control', {
                ctx: {
                    title: "Mediation Control",
                    med_proc: med_proc,
                    update: req.session.update
                }
            });
        });
    });

    /*
      Starts the mediation python process
     */
    app.post('/mediation_start/:id', function(req, res){
        
        MediationProc.findById(req.params.id, function(err, mp){
            if(!mp.running){

                var cmd = new CMD('/usr/bin/python',
                                  [mp.binary_dir,                 //the binary
                                   '-i', mp.cdr_dir,              //cdr directory
                                   '-l', mp.log_dir,]);           //logfile directory
                var tail = new CMD('tail', ['-f', mp.log_dir]);

                cmd.cmd_run();
                       
                cmd.on('cmd_error', function(err){
                    console.log(err);
                    io.emit('message.error', "CMD: Error executing "+err.path);
                    io.emit('message.error', "CMD: with args: "+err.spawnargs);
                });
            }
            /*
              if its running then just
              start tailing its logfile
            */
            io.emit('message.warning', "Looks like the process is running");
            io.emit('message.warning', "Lets try tail the log file");
            tail.cmd_run();

            tail.on('cmd_data', function(data){
                io.emit('message.update', "OUT: "+data);
            });
            
            tail.on('cmd_error', function(err){
                io.emit('message.error', "TAIL: Error executing "+err.path);
                io.emit('message.error', "TAIL: with args: "+err.spawnargs);
            });
        });

        
    });

    /*
      Updates the webpage about the running status
     */
    app.post('/mediation_status_check/:id', function(req, res){
        MediationProc.findById(req.params.id, function(err, mp){
            console.log(req.params.id);
            if(mp.running){
                res.send("running");
            }else{
                res.send("not running");
            }
        });
    });
    
    app.get('/rating_control', function(req, res){
        
    });

    app.get('/billing_control', function(req, res){
        
    });
}
