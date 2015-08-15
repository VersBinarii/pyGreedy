var generate_paging = function(st, div){
    
    div.append("<ul class='pagination'></ul>");

    if(st.numpage == 1){
        $(".pagination").append('<li class="disabled"><a href="#" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }else{
        $(".pagination").append('<li><a href="/mediation_page/'+ st.perpage +'/'
                                + (st.numpage-1) +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }
    for (i = 1; i < 10; i++) {
        if(i == st.numpage){
            $(".pagination").append('<li class="active"><a id="ov-paging-active" href="/mediation_page/'
                                    + st.perpage +'/'+ i +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'">'+ i +'</a></li>');
        }else{
            $(".pagination").append('<li><a href="/mediation_page/'
                                    + st.perpage +'/'+ i +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'">'+ i +'</a></li>');
        }
    }
    $(".pagination").append('<li><a href="/mediation_page/'+ st.perpage +'/'
                            + (st.numpage+1) +'/'+st.sdate+'/'+st.edate+'/'+st.valid+'" aria-label="Previous">'
                            +'<span aria-hidden="true">&raquo;</span></a></li>');
}
