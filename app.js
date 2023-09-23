var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const pug = require('pug');
const sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const errorRouter = require('./routes/error')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/error', errorRouter);





// Connect to the database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });



// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Model synced with the database');
  })
  .catch((err) => {
    console.error('Failed to sync model with the database:', err);
  });







// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});


// global error handler
app.use(function(err, req, res, next) {
  // Set the err.status property to 500 if status isn't already defined
  err.status = err.status || 500;

  // Set the err.message property to a user-friendly message if message isn't already defined
  err.message = err.message || 'An unexpected error occurred.';

  // Log the err object's status and message properties to the console
  console.error(`Error status: ${err.status}`);
  console.error(`Error message: ${err.message}`);

  // Render the error template
  res.render('error', { err });
});









module.exports = app;

