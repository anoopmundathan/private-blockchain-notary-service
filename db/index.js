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
        .on('error', () => {
          reject(error);
        })
        .on('close', () => {
          resolve(height);
        });
    });
  }

  addLevelDBData(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, function (err) {
        if (err) {
          console.log('Block ' + key + ' submission failed', err);
          reject(err);
        }
        resolve(value);
      });
    });
  }
  
}

module.exports = (dbLocation) => new LevelDB(dbLocation);
