#Webhooks Deploy!!!
================

A basic node server meant to be used with github webhooks. 

###Install
```
npm install
node app.js
```

###Options 
####Command Line Arguments
```
-c  Command to run //defaults to 'git pull' 
-d  Directory to run command in //required
-s  Github secret webhooks key //Must be specified in arguments or env variables
-p  Port to run server on //Defaults to 5000
```


A post request to '/' checks the secret header. On success, the command (-c) is run in the directory (-d).

####Enviornmental Variables
```
WEBHOOKS_PORT //defaults to 5000
WEBHOOKS_SECRET //required if not specified in arguments


