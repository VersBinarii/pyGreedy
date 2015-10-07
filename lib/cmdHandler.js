module.exports = {

    var fs = require('fs'),
        spawn = require('child_process').spawn;

    
    exec_cmd: function(command, args, cb){
        cmd = spawn(command, args);

        var output = "";
        
        cmd.stdout.on('data', function(data){

            output += data.toString();
        });

        cmd.stderr.on('data', function(data){

            if(cb){
                cb('error', data);
            }
        });

        cmd.on('close', function(code){
            if(cb){
                cb(code, output);
            }
        });
    }
}
