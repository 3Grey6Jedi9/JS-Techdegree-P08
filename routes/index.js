const express = require('express');
var router = express.Router();
const { Book } = require('../models');
const { Sequelize, Op } = require('sequelize');



router.get('/books', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Get the requested page number or default to 1
  const perPage = 20; // Number of books to display per page
  const search = (req.query.search || '').toLowerCase(); // Get the search query or default to an empty string

    console.log(search)
    try {
    // Define the search condition based on the search query
    const searchCondition = {
      [Op.or]: [
        {
          title: { [Op.like]: `%${search}%` }, // Case-insensitive search for title
        },
        {
          author: { [Op.like]: `%${search}%` }, // Case-insensitive search for author
        },
        {
          genre: { [Op.like]: `%${search}%` }, // Case-insensitive search for genre
        },
        {
          year: { [Op.like]: `%${search}%` }, // Case-insensitive search for year
        },
      ],
    };

    const { count, rows: books } = await Book.findAndCountAll({
      where: search ? searchCondition : {}, // Apply search condition if a search query exists
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    const totalPages = Math.ceil(count / perPage);

    res.render('index', { books, title: 'BOOKS', totalPages, currentPage: page, search });
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

    return res.render('error', {book});


  }

  res.render('show-book', {book})



})


// Rendering the update-book form


router.get("/books/:id/update", async (req, res)=>{


  const book = await Book.findByPk(req.params.id);


  if (!book) {

        return res.render('error', {book});

  }

  res.render('update-book', {book})



})












router.get('/books/:id/delete', async (req, res)=>{

  const book = await Book.findByPk(req.params.id);

  res.render('delete', {book});


});






router.post('/books/:id/delete', async (req, res) => {


    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);

    if (!book) {

        return res.status(404).send('Book not found');

    }

    await book.destroy();

    res.redirect('/books');

});










router.post('/books/:id/update', async (req, res) => {
    const bookId = req.params.id;
    let book; // Define the book variable

    try {
        book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Update the book's properties directly
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.year = req.body.year;

        // Save the changes to the database
        await book.save();
        res.redirect('/books');
    } catch (error) {
        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            // Get the validation error messages
            const validationErrors = error.errors.map((err) => err.message);

            // Render the form with validation errors
            return res.render('update-book', { book, validationErrors });
        } else {
            // Handle other errors
            console.error(error);
            return res.status(500).send('Error updating book');
        }
    }
});















module.exports = router;


