var express = require('express');
//var app = express.app();

var request = require("request");
var cheerio = require("cheerio");
/* GET users listing. */
var db = require("../models");

module.exports = function(app){
  // app.get('/', function(req, res, next) {
  //   res.send('respond with a resource');
  // });

  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://myanimelist.net/news", function(error, response, body) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      //console.log(body);
      var $ = cheerio.load(body);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".news-unit-right").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("p.title")
          .children("a")
          .text();
        result.summary = $(this)
          .children("div.text")
          .text();
        result.link = $(this)
          .children("p.title")
          .children("a")
          .attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.findOneAndUpdate(result, result, {upsert:true})
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Finished Scraping");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        var hbsObject = {
          articles: dbArticle
        };
        //console.log(hbsObject);
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        //console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        //console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  //For saving an article
  app.put("/articles/saved/:id", function(req, res) {
    var condition = {_id : req.params.id}
    var update = {saved : true};
    db.Article.findOneAndUpdate(condition, update)
      .then(function(dbArticle) {
        // View the added result in the console
        
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });

  //For deleting a comment
  app.delete("/articles/:id", function(req, res) {
    var condition = {_id : req.params.id}
    var query = {note : req.params.id}
    db.Note.findOneAndDelete(condition)
      .then(function(dbArticle) {
        // View the added result in the console
        
        //console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });

      db.Article.findOneAndUpdate(query, {$pull: {note: req.params.id}})
      .then(function(dbArticle) {
        // View the added result in the console
        
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });

  app.put("/articles/unsave/:id", function(req, res) {
    var condition = {_id : req.params.id}
    var update = {saved : false};
    db.Article.findOneAndUpdate(condition, update)
      .then(function(dbArticle) {
        // View the added result in the console
        
        return res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });
}
