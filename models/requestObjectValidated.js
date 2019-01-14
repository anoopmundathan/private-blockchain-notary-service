class RequestObjectValidated {
  constructor(walletAddress, requestTimeStamp, message, validationWindow) {
      this.registerStar = true;
      this.status = {
          address: walletAddress,
          requestTimeStamp: requestTimeStamp,
          message: message,
          validationWindow: validationWindow,
          messageSignature: true
      };

  }
}

module.exports = RequestObjectValidated;

