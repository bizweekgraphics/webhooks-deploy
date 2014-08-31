var express = require('express'),
    app = express(),
    childProcess = require('child_process'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/', function(req, res) {
  var secretHeader = req.headers['x-hub-signature']
  var body = JSON.stringify(req.body)
  if(secretCheck(body, secretHeader) === true) {
    childProcess.exec('git pull', {cwd: './../apple-landing/'}, function(err, stdout, stderr) {
      console.log(stdout)
      res.send(stdout)
    })
  } else {
    res.send("Invalid request")
  }
});

function secretCheck(body, hash) {
  var crypto = require('crypto');
  var hmac = crypto.createHmac('sha1', process.env.WEBHOOKS_SECRET)
  hmac.write(body)
  hmac.end()
  return ("sha1=" + hmac.read().toString('hex')) === hash 
}

var port = process.env.WEBHOOKS_PORT || 5000;

app.listen(port);

console.log("Server running on port " + port)

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

process.on('SIGINT', function () {
    console.log( '\nGracefully shutting down from  SIGINT (Crtl-C)' );
    process.exit();
});

process.on('SIGTERM', function () {
    console.log('Parent SIGTERM detected (kill)');
    process.exit(0);
});

