var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/pdf', function(req, res, next) {
  res.render('pdf', { title: 'pdf'})
});

module.exports = router;