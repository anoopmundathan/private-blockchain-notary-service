const BlockChainService = require('../services');
const Block = require("../models/block");
const MemPool = require("../models/memPool");
const Star = require("../models/star");
const hex2ascii = require("hex2ascii");

class BlockChainController {
  
  constructor(app) {
    this.app = app;
    this.memPool = new MemPool();
    this.blockChainService = new BlockChainService();
    this.getBlockByHeight();
    this.getBlockByHash();
    this.getBlockByAddress();
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

  getBlockByHash() {
    this.app.get("/stars/:hash", async (req, res) => {
      const { hash } = req.params;
      const hashParameters = hash.split(':');
      const hashParameter = hashParameters[0];
      const hashValue = hashParameters[1];
      if (hashParameter !== "hash" || !hashValue) {
          res.status(400).send("hash parameter is required");
      } else {
          
          const block = await this.blockChainService.getBlockByHash(hashValue).catch((err) => {
              res.status(500).json(err);
          });

          if (block === -1) {
              res.status(404).json(err);
          } else {
              block.body.star.storyDecoded = hex2ascii(block.body.star.story);
              res.status(200).json(block);
          }
      }
    });
  }

  getBlockByAddress() {
    this.app.get("/stars/:address", async (req, res) => {
      const { hash } = req.params;
      const hashParameters = hash.split(':');
      const hashParameter = hashParameters[0];
      const hashValue = hashParameters[1];
      if (hashParameter !== "address" || !hashValue) {
          res.status(400).send("address parameter is required");
      } else {
          const block = await this.blockChainService.getBlockByAddress(hashValue).catch((err) => {
              res.status(500).json(err);
          });

          if (block === -1) {
              res.status(404).json(err);
          } else {
              block.body.star.storyDecoded = hex2ascii(block.body.star.story);
              res.status(200).json(block);
          }
      }
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
    this.app.post("/block", async (req, res) => {
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
                const newStar = {address: address, star : new Star(star)};
                const newBlock = await this.blockService.addNewBlock(new Block(newStar));
                newBlock.body.star.storyDecoded = hex2ascii(newBlock.body.star.story);
                res.send(newBlock);
            }

        }
    });
}

}

module.exports = (app) => new BlockChainController(app);
