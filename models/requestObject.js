class RequestObject {
  constructor(walletAddress, requestTimeStamp) {
      this.walletAddress = walletAddress;
      this.requestTimeStamp = requestTimeStamp;
      this.message = `${walletAddress}:${requestTimeStamp}:starRegistry`;
  }
}

module.exports = RequestObject;
