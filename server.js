const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('./blockChain');
const Block = require('./block');

const chain = new BlockChain();

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Accepted endpoints: POST /block or GET /block/{BLOCK_HEIGHT}"
}));

app.get('/block/:blockNumber', (req, res) => {
  chain.getBlock(req.params.blockNumber)
    .then((data) => {
      res.send(data)
    })
    .catch(() => {
      res.status(404).json({
        "status": 404,
        "message": "Block not found"
      })
    })
}
);

app.post('/block', (req, res) => {

  if(req.body.body === undefined || req.body.body === '') {
    res.status(400)
    .json({
      "status": 400,
       message: "Body parameter is empty"
    })
  }

  chain.addBlock(new Block(req.body.body))
    .then(() => {
      chain.getBlockHeight()
      .then((height) => {
        chain.getBlock(height)
        .then((response) => {
          res.status(201).send(response)
        })
      })
    })

});

app.listen(8000, () => {
  console.log(`Server running at port ${PORT}`)
});
