const express = require('express');
var router = express.Router();
const {Book} = require('../models');
const app = express();


/* GET home page. */

router.get('/', async function(req,res,next){


  // Asynchronously get all the books from the database

  const books = await Book.findAll();

  console.log(books)

  // Rendering the index file

  res.render('index', {books});

});






module.exports = router;


