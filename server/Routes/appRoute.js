var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

// Import your route files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var locationRouter = require('./routes/location'); // Import the new location route

var app = express();

// View engine setup (if needed for views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev')); // Logs requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Use your routers (API endpoints)
app.use('/', indexRouter); // Default route
app.use('/users', usersRouter); // Users route
app.use('/api/location', locationRouter); // Location route

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page (optional)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
