/**
 * Defines a throwable subclass of Error used for signaling an HTTP status code.
 */
export class HTTPError extends Error {
  /**
     * Constructor for the HTTPResponseError class
     * @param statusCode the HTTP status code
     * @param body - the response body
     * @param headers - optional - the response headers
     */
  constructor (private statusCode, private body) {
    super();
    this.statusCode = statusCode;
    this.body = body;
  }
}