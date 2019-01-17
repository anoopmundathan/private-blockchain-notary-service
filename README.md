# private-blockchain-notary-service
Udacity Blockchain Nanodegree - Project 4: Secure Digital Assets on a Private Blockchain

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

Supported endpoints

- Star registration Endpoint  - POST - /block
- Star Lookup by height       - GET - /block/:height
- Star Lookup by address      - GET - /stars/address:address
- Star Lookup by hash         - GET - /stars/hash:hash
- Blockchain ID validation routine -  POST - /requestValidation
- Validate message signature - POST - /message-signature/validate
