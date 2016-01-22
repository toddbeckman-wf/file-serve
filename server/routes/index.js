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

// entry point: regular get request to the index
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Welcome',
    salt: 1//eventually this can be used to ensure security
  })
}

// TODO: this is very weak authentication
// hash the transaction
// add salt on both side of transaction?
function authenticate(query){
  return query.user && query.pass &&
    query.user == config.user &&
    query.pass == config.password;
}



// Client's first action after entry is to request keys
router.get('keys.json', function (req, res, next) {
  var query = url.parse(req,url, true).query;
  if (!authenticate(query)) {
    res.json({
      error: "error",
      message: "Authentication failed. No keys were made."
    })
  }
  else {
    if (query.file) {
      //  Associate keys with the filename
      var getKey = keys.addkey(file, 'get');
      var putKey = keys.addkey(file, 'put');
      var salt = Math.random();

      //  give those keys to the user
      res.json(JSON.stringify({
        "get": getKey,
        "set": setKey,
        "salt": salt
      }));
    }
    else {
      res.json({
        error: "error",
        message: "No file name requested. No keys were made."
      })
    }
  })
});


// switch to post when security is added
router.get('getfile', function(req, res, next) {
  var query = url.parse(req.url, true).query;
  
  //  authenticate first
  if (!authenticate(query)) {
    res.render('error', {
      title: 'Oops!',
      message: 'Those credentials are not correct!'
    })
  }

  //  Verify the job
  var job = keys.read(query.key);
  if (job.job != query.job) {
    res.render('error', {
      title: 'Oops',
      message: 'Looks like your key is not meant for this job.'
    });
  }

  else {
    // get the path
    var filename = job.name;
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
      keys.remove(query.key);
    }

    // the requested file was not found
    catch (e) {
      res.render('error', { 
        title: 'Oops!',
        message: 'The requested file ' + filename + ' was not found.'
      });
    }
  }
}


// the handler for file uploads
router.post('/upload', upload, function(req, res, next) {
    // todo
  }
);

module.exports = router;