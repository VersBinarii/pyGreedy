var generate_paging = function(numpage, perpage, sdate, edate, div){

    div.append("<ul class='pagination'></ul>");

    if(numpage === 1){
        $(".pagination").append('<li class="disabled"><a href="#" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }else{
        $(".pagination").append('<li><a href="/mediation_page/'+ perpage +'/'+ (numpage-1) +'/'+sdate+'/'+edate+'" aria-label="Previous">'
                                +'<span aria-hidden="true">&laquo;</span></a></li>');
    }
    for (i = 1; i < (8+numpage); i++) {
        if(i === numpage){
            $(".pagination").append('<li class="active"><a href="/mediation_page/'
                                    + perpage +'/'+ i +'/'+sdate+'/'+edate+'">'+ i +'</a></li>');
        }else{
            $(".pagination").append('<li><a href="/mediation_page/'
                                    + perpage +'/'+ i +'/'+sdate+'/'+edate+'">'+ i +'</a></li>');
        }
    }
    $(".pagination").append('<li><a href="/mediation_page/'+ perpage +'/'+ (numpage+1) +'/'+sdate+'/'+edate+'" aria-label="Previous">'
                            +'<span aria-hidden="true">&raquo;</span></a></li>');
}
