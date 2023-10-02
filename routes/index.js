const express = require('express');
var router = express.Router();
const {Book} = require('../models');



router.get('/books', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Get the requested page number or default to 1
  const perPage = 20; // Number of books to display per page

  try {
    const { count, rows: books } = await Book.findAndCountAll({
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    const totalPages = Math.ceil(count / perPage);

    res.render('index', { books, title: 'BOOKS', totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books');
  }
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

    try {
        // Create a new book
        const book = await Book.create({
            title,
            author,
            genre: req.body.genre,
            year: req.body.year
        });

        console.log(`Title: ${title}`);
        console.log(`Author: ${author}`);


        // Redirect the user to the book list page
        res.redirect('/books');
    } catch (error) {
        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            // Get the validation error messages
            const validationErrors = error.errors.map((err) => err.message);

            // Render the form with validation errors
            res.render('new-book', { validationErrors });
        } else {
            // Handle other errors
            console.error(error);
            res.status(500).send('Error creating book');
        }
    }
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


