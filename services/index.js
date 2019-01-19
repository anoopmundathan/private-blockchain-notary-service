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

  async getBlockByHash(hash) {
    const blockChain = await this.initBlockChain();
    return JSON.parse(await blockChain.getBlockByHash(hash));
  }

  async getBlockByAddress(address) {
    const blockChain = await this.initBlockChain();
    return await blockChain.getBlockByWalletAddress(address);
  }

}

module.exports = BlockChainService;
