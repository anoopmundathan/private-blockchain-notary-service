const BlockChainService = require('../services');

class BlockChainController {
  
  constructor(app) {
    this.app = app;
    this.blockChainService = new BlockChainService();
    this.getBlockByHeight();
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

}

module.exports = (app) => new BlockChainController(app);
