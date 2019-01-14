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

  async getBlockByHeight(height) {
    const blockChain = await this.initBlockChain();
    return JSON.parse(await blockChain.getBlock(height));
  }

  async postBlock(block) {
    const blockChain = await this.initBlockChain();
    return JSON.parse(await blockChain.addBlock(block));
  }
}

module.exports = BlockChainService;
