const RequestObject = require('./requestObject');
const bitcoinMessage = require('bitcoinjs-message');

class MemPool {

  constructor() {
      this.memPool = [];
      this.timeoutRequests = [];
  }

  addRequestValidation({ walletAddress }) {
    const isRequestAlreadyInPool = this.timeoutRequests[walletAddress] ? true : false;

    if (isRequestAlreadyInPool) {
      const cachedRequest = this.memPool[walletAddress];
      this.setValidationWindow(cachedRequest);
      return cachedRequest;
    } else {
      this.timeoutRequests[walletAddress] = setTimeout(() => { this.removeValidationRequest(walletAddress) }, 3000);
      const newRequest = new RequestObject(walletAddress, this.getTimeStamp());
      this.memPool[walletAddress] = newRequest;
      this.setValidationWindow(newRequest);
      return newRequest;
    }
  }

  setValidationWindow(requestObject) {
    const timeElapse = this.getTimeStamp() - requestObject.requestTimeStamp;    
    const timeLeft = (3000 / 1000) - timeElapse;
    requestObject.validationWindow = timeLeft;
  }


  removeValidationRequest(address) {
      console.log(`Remove Address: ${address}`);
  }

  getTimeStamp() {
    return new Date().getTime().toString().slice(0, -3);
  }

  validateRequest(walletAddress, signature) {
    
    const request = this.memPool[walletAddress] || null;

    if (!request) {
      return false;  
    }

    let isValid = bitcoinMessage.verify(request.message, walletAddress, signature);
    return isValid;
}

}

module.exports = MemPool;

