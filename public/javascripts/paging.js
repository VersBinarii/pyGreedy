var generate_paging = function(st, div){

    var offset = 0;
    for(x=0;x<1000; x+=10){
        if(Number(st.numpage) < x){
            break;
        }else{
            offset = x;
        }
    }
    
    div.append("<ul class='pagination'></ul>");

    if(st.numpage == 1){
        $(".pagination").append('<li class="disabled"><a href="#" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }else{
        $(".pagination").append('<li><a href="/mediation_page/'+ st.perpage +'/'
                                + (Number(st.numpage)-1) +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }
    for (i = 1+offset; i <= 20+offset; i++) {
        
        var active  = (i == st.numpage)? "active": "";
        
        $(".pagination").append('<li class="'+active+'"><a href="/mediation_page/'
                                + st.perpage +'/'+ i +'/'
                                +st.sdate+'/'+st.edate+'/'+st.valid+'">'+ i +'</a></li>');
    }
    $(".pagination").append('<li><a href="/mediation_page/'+ st.perpage +'/'
                            + (Number(st.numpage)+1) +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'" aria-label="Previous">'
                            +'<span aria-hidden="true">&raquo;</span></a></li>');
}
