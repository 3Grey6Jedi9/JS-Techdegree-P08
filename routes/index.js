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




router.post('/books/new', async (req, res) => {

    // Getting the title and author fields from the request body

    const title = req.body.title;
    const author = req.body.author;

    //Checking if the title and author fields are empty

    if (!title) {

        // Setting the errors property on the request object
        req.errors = {
            title: 'The title field is required.'
        };
        res.render('new-book', req)
        return;

    } else if (!author) {

        req.errors = {

            author: 'The author field is required.'

        };

        res.render('new-book', req)
        return;
    }

  // Create a new book
  const book = await Book.create({
    title,
    author,
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



router.get('/books/:id/deleting', async (req, res)=>{

  const book = await Book.findByPk(req.params.id);

  res.render('deleting', {book});


});






router.post('/books/:id/deleting', async (req, res) => {


    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);

    if (!book) {

        return res.status(404).send('Book not found');

    }

    await book.destroy();

    res.redirect('/books');

});










router.post('/books/:id', async (req, res) => {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Update the book's properties directly
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.year = req.body.year;

    try {
        // Save the changes to the database
        await book.save();
        res.redirect('/books');
    } catch (error) {
        // Handle any errors that occur during saving
        console.error(error);
        res.status(500).send('Error updating book');
    }
});













module.exports = router;


