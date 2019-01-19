const BlockChainService = require('../services/index.js');
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
    this.getBlockByHashOrAddress();
    this.requestValidation();
    this.validateRequest();
    this.registerNewStar();
  }

  getBlockByHeight() {
    this.app.get("/block/:height", (req, res) => {
      const { height } = req.params;
      this.blockChainService.getBlockByHeight(height)
      .then((block) => {
          if (block === -1) {
            res.status(404).json(`There is no block with ${height}`);
          } else {
            if (height !== '0') {
                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            }
            res.status(200).json(block);
          }
      })
      .catch(() => {
        res.status(404).json(`Error while getting block`);
      })
    });
  }

  getBlockByHashOrAddress() {
    this.app.get("/stars/:query", async (req, res) => {
      const { query } = req.params;
      const queryParameters = query.split(':');
      const queryKey = queryParameters[0];
      const queryValue = queryParameters[1];

      if (queryKey !== "hash" && queryKey !== "address" || !queryValue) {
        res.status(400).send('query parameter is required hash:[hash] or address:[address]');
      } else {

          let blocks;

          if (queryKey === "hash") {
              blocks = await this.blockChainService.getBlockByHash(queryValue).catch((err) => {
                  res.send(500).json(err);
              })
          }

          if (queryKey === "address") {
              blocks = await this.blockChainService.getBlockByAddress(queryValue).catch((err) => {
                  res.status(500).json(err);
              });
          }

          if (blocks === -1) {
              res.status(404).json(`No star registered with ${queryKey}: ${queryValue}`);
          } else {
              if (Array.isArray(blocks)) {
                blocks.map(block => {
                    block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                });
              } else {
                  blocks.body.star.storyDecoded = hex2ascii(blocks.body.star.story);
              }
              res.status(200).json(blocks);
          }
      }

    });
  }

  requestValidation() {
    this.app.post("/requestValidation", async (req, res) => {
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
                const newBlock = await this.blockChainService.postBlock(new Block(newStar));
                newBlock.body.star.storyDecoded = hex2ascii(newBlock.body.star.story);
                res.send(newBlock);
            }

        }
    });
  }

}

module.exports = (app) => new BlockChainController(app);
