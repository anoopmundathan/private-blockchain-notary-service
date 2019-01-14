const RequestObject = require('./requestObject');
const RequestObjectValidated = require('./requestObjectValidated');
const bitcoinMessage = require('bitcoinjs-message');

class MemPool {

  constructor() {
      this.memPool = [];
      this.mempoolValid = [];
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

  setValidationWindow(request) {
    const timeLeft = this.getValidationWindow(request);
    request.validationWindow = timeLeft;
  }

  getValidationWindow(request) {
      const timeElapse = this.getTimeStamp() - request.requestTimeStamp;
      const timeLeft = (3000 / 1000) - timeElapse;
      request.validationWindow = timeLeft;
      return timeLeft;
  }

  removeValidationRequest(address) {
      this.timeoutRequests = this.timeoutRequests.filter(r => r.walletAddress !== walletAddress);
      console.log(`Remove Address: ${address}`);
  }

  getTimeStamp() {
    return new Date().getTime().toString().slice(0, -3);
  }



  validateRequestByWallet(walletAddress, signature) {
    
    const request = this.memPool[walletAddress] || null;

    if (!request) {
      return false;  
    }

    let isValid = bitcoinMessage.verify(request.message, walletAddress, signature);
    return isValid;
  }

  addRequest() {
    const request = this.memPool[walletAddress] || null;
    
    if (!request) {
      return false;  
    }

    const { requestTimeStamp, message } = request;
    const validationWindow = this.getValidationWindow(request);
    const newReq = new RequestObjectValidated(walletAddress, requestTimeStamp, message, validationWindow);
    this.removeValidationRequest(walletAddress);
    this.mempoolValid[walletAddress] = newReq;
    return newReq;
  }

}

module.exports = MemPool;

