var express = require('express'),
    app = express(),
    childProcess = require('child_process'),
    parseArgs = require('minimist'),
    bodyParser = require('body-parser');

var argv = parseArgs(process.argv);
var appDirectory = argv.d;
var command = argv.c || 'git pull';
var secretKey = argv.s || process.env.WEBHOOKS_SECRET;
var serverPort = argv.p || process.env.WEBHOOKS_PORT || 5000;

if(!appDirectory) {
  console.error("You must specify a directory");
  process.exit();
}

if(!secretKey) {
  console.error("You must specify a github secret key");
  process.exit();
}


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/', function(req, res) {
  var secretHeader = req.headers['x-hub-signature']
  var body = JSON.stringify(req.body)
  if(secretCheck(body, secretHeader) === true) {
    childProcess.exec('git pull', {cwd: appDirectory}, function(err, stdout, stderr) {
      console.log(stdout)
      res.send(stdout)
    })
  } else {
    res.send("Invalid request")
  }
});

function secretCheck(body, hash) {
  var crypto = require('crypto');
  var hmac = crypto.createHmac('sha1', secretKey)
  hmac.write(body)
  hmac.end()
  return ("sha1=" + hmac.read().toString('hex')) === hash 
}

app.listen(serverPort);

console.log("Server running on port " + serverPort)

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

