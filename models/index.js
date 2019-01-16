const SHA256 = require('crypto-js/sha256');
const levelDB = require("../db")("./blockchain");
const Block = require('./block');

class BlockChain {
  constructor() {
  }
  
  static async initBlockChain() {
    const length = await levelDB.getHeight();
    console.log("length", length);
    if (length === -1) {
      const genesisBlock = JSON.stringify(BlockChain.createGenesisBlock());
      const newGenesisBlock = await levelDB.addData(0, genesisBlock);
      if (newGenesisBlock) {
        console.log('Genesis Block created');
      }
    }
    return new BlockChain();
  }

  static createGenesisBlock() {
    const genesisBlock = new Block('First block');
    genesisBlock.height = 0;
    genesisBlock.time = new Date().getTime().toString().slice(0, -3);
    genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
    return genesisBlock;
  }

  getBlock(height) {
    return levelDB.getData(height);
  }

  async addBlock(newBlock) {

    let currentHeight = await levelDB.getHeight();

    if (currentHeight === -1) {
      console.log('Adding Genesis');
      const genesisBlock = await levelDB.addData(0, JSON.stringify(BlockChain.createGenesisBlock()));
    }

    currentHeight = await levelDB.getHeight() + 1;
    newBlock.height = currentHeight;
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    newBlock.previousBlockHash = JSON.parse(await levelDB.getData(currentHeight - 1)).hash;
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    const newGeneratedBlock = await levelDB.addData(currentHeight, JSON.stringify(newBlock));
    return newGeneratedBlock;
  }

  getBlockByHash(blockHash) {
    return levelDB.getBlockByHash(blockHash);
  }

  getBlockByWalletAddress(address) {
    return levelDB.getBlockByWalletAddress(address);
  }

}

module.exports = BlockChain;
