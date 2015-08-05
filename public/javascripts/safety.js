var safe_del_button = function($checkbox, $d_bttn){
    var ch_box = $checkbox;
    var del_btn = $d_bttn; 
    ch_box.click(function(){
	if(ch_box.is(':checked')){
	    del_btn.removeClass('disabled');
	}else{
	    del_btn.addClass('disabled');
	}
    });
};
