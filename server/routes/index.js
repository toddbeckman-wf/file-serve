var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');
var keys = require('./keys');
var multer = require('multer');
var router = express.Router();
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, pdfLoc);
    },
    filename: function(req, file, cb) {
      cb(null, (req.body.name? req.body.name: file.fieldname)
        + path.extname(file.originalname));
    }
  }),
  limits: {
    files: 1
    // here might be a good place to choke filesize as well
  }
});

var docLoc = __dirname + "../../" + config.doc_loc;
var pdfLoc = __dirname = "../../" + config.pdf_loc;

function authenticate(query){
  //  TODO: this is very weak authentication
  //  hash the transaction
  //  add salt on both side of transaction?
  return query.u && query.p &&
    query.u == config.user &&
    query.p == config.password;
}

function createJobs(res, file) {
  var getKey = keys.addkey(file, 'get');
  var putKey = keys.addkey(file, 'put');
  var salt = Math.random();
  res.json(JSON.stringify({
    "get": getKey,
    "set": setKey,
    "salt": salt
  }));
}


function getFile(res, query) {
  var job = keys.read(query.key);
  if (job.job != query.job) {
    res.render('index', {
      title: 'Oops',
      message: 'Looks like your key is not meant for this job.'
    });
  }
  else {
    var filename = job.name;

    // get the path
    var path = docLoc + filename;

    // prepare the response header; need the size
    try {
      var stat = fs.statSync(filePath);
      res.writeHead(200, {
'Content-Disposition': 'attachment; filename="' + filename + '"',
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
}

function putFile(req, res, query) {
}

router.post('/upload', upload, function(req, res, next) {
    var query = url.parse(req.url, true).query;
  }
)

// when a post request has been made
router.post('/', function(req, res, next)) {
  var query = url.parse(req.url, true).query;
  if (!authenticate(query)) {
    res.render('index', {
      title: 'Oops!',
      message: 'Those credentials are not correct!'
    })
  }

  if (query.job) {
    switch (query.job) {
    case 'get':
      getFile(res, query);
      break;
    case 'put':
      putFile(req, res, query);
      break;
    default:
      res.render('index', {
        title: 'Oops!',
        message: 'That job is not supported!'
      })
    }
  }
  else {
    if (query.file) {
      createJobs(res, query.file);
    }
    else {
      res.render('index', {
        title: 'Oops!',
        message: 'You specified neither a job nor a file!'
      })
    }
  }
}

module.exports = router;