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



router.post('/books/new', async (req, res) => {
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



router.get("/books/:id", async (req, res)=>{


  const book = await Book.findByPk(req.params.id);

  if (!book) {

    return res.status(404).send('Book not found');


  }

  res.render('show-book', {book})



})











module.exports = router;


