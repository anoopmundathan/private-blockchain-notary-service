const RequestObject = require('./requestObject');
const RequestObjectValidated = require('./requestObjectValidated');
const bitcoinMessage = require('bitcoinjs-message');

class MemPool {

  constructor() {
      this.memPool = [];
      this.mempoolValid = [];
      this.timeoutRequests = [];
      this.timeoutValidRequests = [];
  }

  addRequestValidation({ walletAddress }) {
    const isRequestAlreadyInPool = this.timeoutRequests[walletAddress] ? true : false;

    if (isRequestAlreadyInPool) {
      const cachedRequest = this.memPool[walletAddress];
      this.setValidationWindow(cachedRequest);
      return cachedRequest;
    } else {
      this.timeoutRequests[walletAddress] = setTimeout(() => { this.removeValidationRequest(walletAddress) }, 5 * 60 * 1000);
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
      const timeLeft = (5 * 60 * 1000 / 1000) - timeElapse;
      request.validationWindow = timeLeft;
      return timeLeft;
  }

  removeValidationRequest(walletAddress) {
      this.timeoutRequests = this.timeoutRequests.filter(r => r.walletAddress !== walletAddress);
  }

   removeValidationValidRequest(walletAddress) {
    this.timeoutValidRequests = this.timeoutValidRequests.filter(r => r.walletAddress !== walletAddress);
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

  addRequest(walletAddress) {
    const request = this.memPool[walletAddress] || null;
    
    if (!request) {
      return false;  
    }

    const { requestTimeStamp, message } = request;
    const validationWindow = this.getValidationWindow(request);
    const newReq = new RequestObjectValidated(walletAddress, requestTimeStamp, message, validationWindow);
    this.removeValidationRequest(walletAddress);
    this.timeoutValidRequests[walletAddress] = setTimeout(() => { this.removeValidationValidRequest(walletAddress) }, 30 * 60 * 1000);
    this.mempoolValid[walletAddress] = newReq;
    return newReq;
  }

  getExistingValidRequest(address) {
    return this.timeoutValidRequests[address] ? this.mempoolValid[address] : null
  }

}

module.exports = MemPool;

