export interface BaseResponse {
  error?: boolean
  statusCode: number
  message: string
  data?: unknown
}
