var socket_update = function(div){
    var sock = io.connect('localhost:3000');
    
    sock.on('connect', function(data){
        sock.emit('join', "Client connected");
        
        div.text("Client connected");
    });

    sock.on('message.update', function(update){
        div.append('<p>'+update+'</p>');
    });

    sock.on('message.error', function(update){
        div.append('<p style="color:red;">'+update+'</p>');
    });
}

var submit_import = function(form){
    form.submit(function(e){
        e.preventDefault();

        var fd = new FormData($(this)[0]);
        $.ajax({
            url: '/import_csv',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST'
        });
    });
}
