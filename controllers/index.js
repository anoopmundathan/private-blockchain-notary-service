const BlockChainService = require('../services');
const Block = require("../models/block");
const MemPool = require("../models/memPool");
const Star = require("../models/star");

class BlockChainController {
  
  constructor(app) {
    this.app = app;
    this.memPool = new MemPool();
    this.blockChainService = new BlockChainService();
    this.getBlockByHeight();
    this.postBlock();
    this.requestValidation();
    this.validateRequest();
    this.registerNewStar();
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
      const requestObject = this.memPool.addRequestValidation({ walletAddress: address });
      res.send(requestObject);
    });
  }

  validateRequest() {
    this.app.post("/message-signature/validate", (req, res) => {
        const { address, signature } = req.body;
        if (!address || !signature) {
            res.status(400).send('The address and the signature are required');
        } else {
            const isValid = this.memPool.validateRequestByWallet(address, signature);
            if (!isValid) {
                res.status(400).send('Not a valid signature or request');
            } else {
                const newReq = this.memPool.addRequest(address);
                res.send(newReq);
            }
        }
    });
  }

  registerNewStar() {
    this.app.post("/star", async (req, res) => {
        const { address, star } = req.body;
        if (!address || !star || !star.ra
            || !star.dec || !star.story) {
            res.status(400).send('address and star properties are mandatory');
        } else {
            const validRequest = this.memPool.getExistingValidRequest(address);
            if (!validRequest) {
                res.status(400).send('The request has expired or already used.');
            } else {
                this.memPool.removeValidationValidRequest(address);
                const newStar = new Star(star);
                const newBlock = await this.blockService.addNewBlock(newStar);
                res.send(newBlock);
            }

        }
    });
}

}

module.exports = (app) => new BlockChainController(app);
