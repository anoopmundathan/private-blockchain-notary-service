const BlockChainService = require('../services');
const Block = require("../models/block");

class BlockChainController {
  
  constructor(app) {
    this.app = app;
    this.blockChainService = new BlockChainService();
    this.getBlockByHeight();
    this.postBlock();
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

}

module.exports = (app) => new BlockChainController(app);
