// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        `<p data-id='${data[i]._id}'>${data[i].title}<br /><a href='https://www.bbc.com/${data[i].link}' target='blank'>Go To Article</a></p><button data-id='${data[i]._id}' class='btn-note btn btn-outline-primary btn-sm' style='margin-right:10px;'>Note</button><button id='btn-save' data-id='${data[i]._id}' class='btn btn-outline-primary btn-sm'>Save Article</button>`);
    }
    console.log(data);
  });
  
  //Whenever someone clicks on Scrape New Articles button
  $(document).on("click", "btn btn-primary", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .done(function(data){
      console.log(data);
      location.reload();
    })
  })
  // Whenever someone click on the note button
  $(document).on("click", ".btn-note", function() {
    // Empty the notes from the note section
    $("#note").empty();
    $(".input").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#note").append("<h4>" + data.title + "</h4>");
        // A textarea to add a new note body
        $(".input").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".input").append("<button data-id='" + data._id + "' id='savenote'class='btn btn-primary btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#note").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val(" ");
  });

// When you click the Save Article button
$(document).on("click", "#btn-save", function() {
  $(this).addClass("disabled");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
 
  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId,
 
  })
 
  .done(function(data) {
      console.log(data);
  });
 });


  