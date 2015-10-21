var render_update = function(update){
    if(!update){
        return;
    }
    var modal = document.getElementById('modal-window');
    var modal_header = document.getElementById('modal-header');
    var modal_body = document.getElementById('modal-body');
    //var modal_error = document.getElementById('modal-error');
    modal_header.innerHTML = update.type;
    modal_body.innerHTML = update.message;

    switch(update.type){
    case "Error":
        modal_header.style.background = "red";
        modal_body.style.background = "red";
        //modal_error.innerHTML = update.raw_err.message;
        break;

    case "Warning":
        modal_header.style.background = "orange";
        modal_body.style.background = "orange";
        break;

    case "Info":
        modal_header.style.background = "#7fba00";
        modal_body.style.background = "#7fba00";
        break;
    }
    
    modal.style.opacity = 100;

    setTimeout(function(){ modal.style.opacity = 0; }, 3500);
}
