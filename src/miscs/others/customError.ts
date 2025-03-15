export default class CustomError extends Error {
  public statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = "CustomError" // Set the error name so that it is easier to identify in logs.

    // Better stack trace for debugging.
    Error.captureStackTrace(this, this.constructor)
  }
}
