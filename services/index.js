class BlockChainService {
  constructor() {
    this.blockChain = null;
    console.log("In Service");
  }
}

module.exports = () => new BlockChainService();
