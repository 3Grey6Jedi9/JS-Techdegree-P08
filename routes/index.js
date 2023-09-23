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










module.exports = router;


