class MemPool {

  constructor() {
      this.mempool = [];
      this.timeoutRequests = [];
  }

  addRequestToPool(request) {
      this.timeoutRequests[request.walletAddress] = setTimeout(() => { this.removeValidationRequest(request.walletAddress) }, 3000);
  }

  removeValidationRequest(address) {
      console.log(`Remove Address: ${address}`);
  }

}

module.exports = MemPool;

