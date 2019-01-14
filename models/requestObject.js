class RequestObject {
  constructor(walletAddress, requestTimeStamp, message, validationWindow) {
      this.walletAddress = walletAddress;
      this.requestTimeStamp = requestTimeStamp;
      this.message = message;
      this.validationWindow = validationWindow;
  }
}

module.exports = RequestObject;
