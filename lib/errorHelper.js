module.exports = {
 
    set_error: function(message, raw_err){
        return set_update("Error", message, raw_err);
    },
    set_warning: function(message, raw_err){
        return set_update("Warning", message, raw_err);
    },
    set_info: function(message){
        return set_update("Info", message, null);
    }
    
}

function set_update(type, message, raw_err){
    return {
        type: type,
        message: message,
        raw_err: raw_err
    }
}

