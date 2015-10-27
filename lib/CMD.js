var spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter;

var CMD = function(command, args) {
    EventEmitter.apply(this);
    this.command = command;
    this.args = args;
}

CMD.prototype = new EventEmitter();
CMD.prototype.cmd_run = function(){
    var self = this;
    var cmd = spawn(this.command, this.args);

    //cmd.stdout.setEncoding('utf8');
    cmd.stdout.on('data', function(data){
        var lines = data.toString().split('\n');
        lines.forEach(function(line){
            self.emit('cmd_data', line);
        });
    });

    cmd.stderr.on('data', function(data){
        var lines = data.toString().split('\n');
        lines.forEach(function(line){
            self.emit('cmd_error', line);
        });
    });

    cmd.on('close', function(code){
        self.emit('cmd_close', "Command exited :"+code);
    });

    cmd.on('error', function(error){
        // kill it on error
        self.emit('cmd_error', error);
    });
}

module.exports = CMD;
