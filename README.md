# private-blockchain-notary-service
Udacity Blockchain Nanodegree - Project 4: Build a Private Blockchain Notary Service

## Framework used

Express.js

### Setup
```
$ git clone https://github.com/anoopmundathan/private-blockchain-notary-service.git
$ cd private-blockchain-notary-service
```
### Install
```
$ npm i
```
### Run
``` 
$ node server.js
```
### View application
``` 
http://localhost:8000
```
Use postman or CURL on the terminal to send the requests to the base url http://localhost:8000 with one of the below supported endpoints:

- POST
/block

example:

```
curl 
-X "POST" "http://localhost:8000/block" 
-H 'Content-Type: application/json' 
-d $'{"body":"test data"}'
```

- GET
http://localhost/block/{BLOCK_HEIGHT}

example
```
curl http://localhost:8080/block/0
```
