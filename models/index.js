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
      const newGenesisBlock = await levelDB.addLevelDBData(0, genesisBlock);
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

}

module.exports = BlockChain;
