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



// Render pages

// Home route

app.get('/', function(req,res){

  // Redirect the user to the /books route

  res.redirect('/books')
});

// Books route

app.get('/books', async function (req,res){

  // Getting the full list of books from the database

  const books = await Book.findAll();

  // Rendering all the books

  res.render('books', {books});

});




// Showing the create new book form

app.get('/books/new', function (req,res){

  // Rendering the new-book.pug file

  res.render('new-book');

});

// Posting a new book to the database

app.post('books/new',  async function (req,res){

      // Creating a new book in the database using the data that was submitted from the form

  const book = await Book.create(req.body);

      // Redirect the user to the show book page for the new book

  res.redirect('/books/${book.id}');

});


// Showing book detail form


app.get('/books/:id', async function(req,res){


  // Getting the book with the specified ID from the database

  const book = await Book.findByPk(req.params.id);

  // If the book does not exist, sending a 404 error

  if (!book) {

  res.sendStatus(404);

  return;

  }

  // Rendering the show-book.pug file, passing in the book
  res.render('show-book', {book});

});



// Updating book info in the database

app.post('/books/:id', async function(req,res){

  // Getting the book with the specified ID from the database

  const book = await Book.findByPk(req.params.id);

  // If the book does not exists, send a 404 error

  if (!book) {

    res.sendStatus(404);
    return;

  }

  // Update the book's data using the data that was submitted from the form

  book.title = req.body.title;
  book.author = req.body.author;
  book.releaseDate = req.body.releaseDate;

  // Saving the updated book to the database

  await book.save();

  // Redirecting the user to the show book page for the update book

  res.redirect('/books/${book.id}');

});







// DELETING A BOOK FROM THE DATABASE
app.post('/books/:id/delete', async function (req,res) {


  // Getting the book with the specified ID from the databse

  const book = await Book.findByPk(req.params.id);

  // If the book does not exist, send a 404 error

  if (!book) {

  res.sendStatus(404);
  return;

  }

  // Delete the book from the database

  await book.destroy();

  // Redirect the user to the list of books
  res.redirect('/books')

})










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
