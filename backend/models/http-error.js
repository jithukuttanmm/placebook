class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // add message proprty in parent
    this.code = errorCode;
  }
}
module.exports = HttpError;
