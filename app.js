var express = require('express'),
    app = express(),
    childProcess = require('child_process');


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

app.listen(process.env.WEBHOOKS_PORT || 5000);