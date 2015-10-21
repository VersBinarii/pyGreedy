var import_rs_show_type = function(){
    
    var import_type = $('select#import-type');
    import_type.change(function(){
        var option = import_type.find(':selected').val();
        if(option === 'ratesheet'){
            $('#import-rs-type').show('slow');
        }else{
            $('#import-rs-type').hide('slow');
        }
    });
}
