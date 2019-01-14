const BlockChainService = require('../services');
const Block = require("../models/block");
const MemPool = require("../models/memPool");

class BlockChainController {
  
  constructor(app) {
    this.app = app;
    this.memPool = new MemPool();
    this.blockChainService = new BlockChainService();
    this.getBlockByHeight();
    this.postBlock();
    this.requestValidation();
  }

  getBlockByHeight() {
    this.app.get("/block/:height", (req, res) => {
      const { height } = req.params;
      this.blockChainService.getBlockByHeight(height)
      .then((block) => {
        res.status(200).json(block);
      })
      .catch((err) => {
        res.status(404).json(err);
      })
    });
  }

  postBlock() {
    this.app.post("/block", (req, res) => {
      const { body } = req.body;
      if (body) {
        this.blockChainService.postBlock(new Block(body))
        .then((block) => {
          res.status(200).json(block)
        })
        .catch((err) => {
          res.status(500).json(err)
        })
      } else {
        res.status(400).json("post error");
      }
    });
  }

  requestValidation() {
    this.app.post("/requestValidation", (req, res) => {
      const { address } = req.body;
      this.memPool.addRequestToPool({ walletAddress: address });
      res.send({ 
        walletAddress: address,
        requestTimeStamp: 1234,
        message: "hello",
        validationWindow:  300
      })
    });
  }

}

module.exports = (app) => new BlockChainController(app);
