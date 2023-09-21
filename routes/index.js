const express = require('express');
var router = express.Router();
const Book = require('../models').Book;


/* GET home page. */
router.get('/', async function(req, res, next) {
  // Delete or comment out the res.render() method.

  // Asynchronously get all the books using the findAll() method and store them in a variable.
  const books = await Book.findAll();

  // Log out the books variable to the console.
  console.log(books);

  // Use the res.json() method to display the books on a webpage.
  res.json(books);
});

module.exports = router;


