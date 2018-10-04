$(function(){
    $(".scrape").on("click", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"
          }).then(function(data){
            $(".result").text(data);
          });
    });
    $("#reload").on("click", function(){
        $("#scraped").modal("toggle");
        location.reload();
    })
})