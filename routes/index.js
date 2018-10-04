//var express = require('express');
//var router = express.Router();

var db = require("../models");
module.exports = function(app) {
/* GET home page. */
  app.get('/', function(req, res, next) {
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

  app.get('/saved', function(req, res, next) {
    db.Article.find({saved : true})
      .then(function(dbArticle) {
        var hbsObject = {
          articles: dbArticle
        };
        //console.log(hbsObject);
        // If we were able to successfully find Articles, send them back to the client
        res.render("saved", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

}

