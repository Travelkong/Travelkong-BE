import type { BaseResponse } from "~/miscs/others"
import type CommentsModel from "./comments.model"

export default interface CommentsResponse extends BaseResponse {
  total?: number
  response?: CommentsModel | CommentsModel[]
}
