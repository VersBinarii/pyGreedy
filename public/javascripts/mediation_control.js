var mediation_start = function(form){
    form.submit(function(e){
        e.preventDefault();
        
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: new FormData($(this)[0]),
            processData: false,
            contentType: false
        });
    });
}

var running_state_check = function(timeout, id){
    $.ajax({
        url: '/mediation_status_check/'+id,
        type: 'POST',
        data: null,
        success: function(data){
            if(data === "running"){
                $('span#running_state').css('color', 'green');
            }else{
                $('span#running_state').css('color', 'red');
            }
            
            $('span#running_state').html(data);
            
            setTimeout(function(){
                running_state_check(timeout, id);
            },timeout);
        }
    });
}
