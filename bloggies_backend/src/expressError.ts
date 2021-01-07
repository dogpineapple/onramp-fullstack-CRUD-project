/** ExpressError class inherits from JS Error class.
 *  Creates an error that includes a message and a status code.
 */

class ExpressError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
    console.error(this.stack);
  }
}

module.exports = ExpressError;