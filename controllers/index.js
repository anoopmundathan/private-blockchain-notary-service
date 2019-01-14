class BlockChainController {
  constructor(app) {
    this.app = app;
    this.blockChainService = require("../services")();
  }
}

module.exports = (app) => new BlockChainController(app);
