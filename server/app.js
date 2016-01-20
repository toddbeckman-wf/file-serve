

/**
 * Module dependences.
 */

var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyparser = require('bodyparser');
var routes = require('./routes/index')

var app = express();

// tell how to render
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// parse the responses as necessary
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// link to the public folder
app.use(express.static(path.join(__dirname, 'public')));

//  link up the router
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// default is development
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;