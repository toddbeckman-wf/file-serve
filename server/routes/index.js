var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');
var router = express.Router();

/* GET home page. */
/* was used for getting server set up
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    message: 'Well what do you know about that.'
  });
});
*/

// switch to post when the client side has been set up to use post
//router.post('/doc', function(req, res, next) {
router.get('/doc', function(req, res, next) {
  // here would be an ideal place for authentication  

  // here would be an ideal place to get the file name
  var query = url.parse(req.url, true).query;
  var filename = query.filename;
  if (!filename) {
    res.render('index', {
      title: 'Oops!',
      message: 'You forgot to request a filename. Received:\n' + filename
    });
  }
  else {
    // get the path
    var filePath = path.join(__dirname, '..', 'files', 'docx', filename);

    // prepare the response header; need the size
    try {
      var stat = fs.statSync(filePath);
      res.writeHead(200, {
        "Content-Disposition": 'attachment; filename="'+filename+'"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Length': stat.size
      });
      // stream the file as it is loaded
      var readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    }
    // the requested file was not found
    catch (e) {
      res.render('index', { 
        title: 'Oops!',
        message: 'The requested file ' + filename + ' was not found.'
      });
    }
  }
});

module.exports = router;