const BlockChain = require("../models");

class BlockChainService {
  constructor() {
    this.blockChain = null;
  }

  async initBlockChain() {
    if (this.blockChain === null) {
      this.blockChain = await BlockChain.initBlockChain();
      return this.blockChain
    }
    return this.blockChain;
  }


}

module.exports = BlockChainService;
