const express = require('express');

const router = express.Router();

router.get('/intentional-error', (req, res) => {
  throw new Error('Internal server error.');
});

module.exports = router;


