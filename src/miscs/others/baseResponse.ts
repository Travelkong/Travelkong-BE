export abstract class BaseResponse {
  error?: boolean
  statusCode: number
  message: string

  constructor(statusCode: number, message: string, error?: boolean) {
    this.statusCode = statusCode
    this.message = message
    this.error = error
  }
}
