$(function(){

  $(".save").on("click", function(){
    var thisId = $(this).attr("data-id");
    /*var updateByID = {
      _id : thisId
    }*/
    console.log(thisId);
    $.ajax("/articles/saved/"+thisId, {
      type: "PUT"
    }).then(
      function() {
        console.log("updated");
        // Reload the page to get the updated list
        //location.reload();
      }
    );
  })
  
  $(".article").on("click", ".showcomment", function() {
    // Empty the notes from the note section
    //console.log("jello");
    $("#notes").empty();
    
    var thisId = $(this).parent().attr("data-id");
    //console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        //console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<div class='allNotes'></div>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        //$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $("#savenote").attr("data-id", data._id)
        
        // If there's a note in the article
        if (data.note) {
          
          //console.log(data.note);
          $.each(data.note, function(key, value){
            $(".allNotes").append("<div class='singleNote'>"+ value.body +
            "<button data-id='" + value._id + "' class='deleteNote btn btn-danger'>X</button></div>");
          })
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    if($("#bodyinput").val().trim() === ""){
      $("#invComment").text("Do not leave empty comment");
      return;
    }
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        creator: thisId,
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        //console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#invComment").text("");
    $("#comments").modal('toggle');
  });

  //delete note
  $(document).on("click", ".deleteNote", function() {
    var thisId = $(this).attr("data-id");
    //console.log("deleteing");
    // Send the DELETE request.
    $.ajax("/articles/" + thisId, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted note", thisId);
        // Reload the page to get the updated list
        $("#comments").modal('toggle');
      }
    );
    $("#comments").modal('toggle');
  })

  //unsave article
  $(".article").on("click", ".unsave", function() {
    var thisId = $(this).parent().attr("data-id");
    console.log(thisId);
    // Send the DELETE request.
    $.ajax("/articles/unsave/"+thisId, {
      type: "PUT"
    }).then(
      function() {
        console.log("updated");
        // Reload the page to get the updated list
        location.reload(true);
      }
    );
  })
})

