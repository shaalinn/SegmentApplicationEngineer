var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var bcrypt = require('bcrypt-nodejs');

var routes = require('./routes/index');
var signinup = require('./routes/signinup');
var header = require('./routes/header');
var pool = require("./routes/databasePool");
var cronBid = require('./routes/billingCron');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName:'session',
  secret: 'ebay123456789',
  duration: 30*60*1000,
  activeDuration: 5*60*1000,
}));


app.get('/', routes.indexPage);
app.get('/signinup', signinup.loginpage);
app.post('/register', signinup.register);
app.get('/signout', signinup.signout);



app.get('/checkuser', signinup.checkuser);
app.get('/header', header.headerFile);


app.post('/login', signinup.login);
app.get('/data', routes.tables);
app.get('/approve', routes.approve);
app.post('/sendBill', routes.sendBill);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

pool.initializePool(15,50);

// error handlers

// development error handler
// will print stacktrace
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
