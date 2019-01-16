const level = require('level');

class LevelDB {

  constructor(dbLocation) {
    this.db = level(dbLocation);
  }
  
  getHeight() {
    return new Promise((resolve, reject) => {
      let height = -1;
      this.db.createReadStream()
        .on('data', (data) => {
          height++;
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('close', () => {
          resolve(height);
        });
    });
  }

  addData(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, function (err) {
        if (err) {
          console.log(`Block${key} adding failed ${err}`);
          reject(err);
        }
        resolve(value);
      });
    });
  }

  getData(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, function (err, value) {
        if (err) {
          reject(-1);
        };
        resolve(value);
      })
    });
  }

  getBlockByHash(hash) {
    let block = -1;
    return new Promise((resolve, reject) => {
      this.db.createReadStream().on('data', function (data) {
        const blockParsed = JSON.parse(data.value);
        if (blockParsed.hash === hash) {
          block = data.value;
        }
      }).on('error', function (err) {
        console.log('Unable to read data stream!', err);
        reject(err);
      }).on('close', function () {
        if (block === -1) {
          resolve(-1);
        }
        resolve(block);
      });

    });
  }

  getBlockByWalletAddress(address) {
    let blocks = [];
    return new Promise((resolve, reject) => {
      this.db.createReadStream().on('data', function (data) {
        const blockParsed = JSON.parse(data.value);
        if (!!blockParsed.body.address && blockParsed.body.address === address) {
          blocks.push(blockParsed);
        }
      }).on('error', function (err) {
        console.log('Unable to read data stream!', err);
        reject(err);
      }).on('close', function () {
        if (blocks.length === 0) {
          resolve(-1);
        }
        resolve(blocks);
      });

    });
  }
  
}

module.exports = (dbLocation) => new LevelDB(dbLocation);
