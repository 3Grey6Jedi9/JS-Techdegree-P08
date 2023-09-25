const express = require('express');
var router = express.Router();
const {Book} = require('../models');



router.get('/books', async (req,res)=> {

  const books = await Book.findAll()

  res.render('index', {books, title: 'BOOKS'});


});


/* GET home page. */

router.get('/', async function(req,res,next){

  // Asynchronously get all the books from the database

  const books = await Book.findAll();

  console.log(books)

  // Rendering the index file

  res.redirect('/books');

});

// Rendering the new-book form


router.get('/books/new', (req, res)=>{

  res.render('new-book');


});


router.get('/books/update', (req, res)=>{

  res.render('update-book');


});



// Middleware function that checks if all of the required fields are present in the form data

router.use('/books/new', (req,res,next)=>{

  // Checking if the title field is present
  if (!req.body.title) {

    req.error = 'The title field si required.'
    return next();

  }

  // Checking if the genre field is present
  if (!req.body.genre) {

    req.error = 'The genre field is required.';
    return next();


  }


  // Check if the year field is present
  if (!req.body.year) {

    req.error = 'The year field is required.';
    return next();
  }

  // If all of the required fields are present, continue to the next middleware function
  next();


});



// Route handler for the /books/new route

router.post('/books/new', async(req, res) =>{

  if(req.error) {
    // Render the error page

    return res.render('error', {error: req.error});


  }

  // Create a new book

  const book = await Book.create({

    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year


  });

  // Redirect the user to the book list page
  res.redirect('/books');


});























module.exports = router;


