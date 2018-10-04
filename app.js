//var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
var logger = require('morgan');
var PORT = 3000;
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/scrape');


var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// Require all models
//var db = require("./models");

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.engine("handlebars", exphbs({ 
  defaultLayout: "main" ,
  partialsDir: __dirname + '/views/partials/'
}));
app.set("view engine", "handlebars");

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

 //app.use('/', indexRouter);
 //app.use('/users', usersRouter);


// Routes
require("./routes/index")(app);
require("./routes/scrape")(app);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
//mongoose.dropDatabase();
// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
