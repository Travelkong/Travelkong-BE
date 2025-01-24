import type { BaseResponse } from "~/miscs/others"
import type TagsModel from "./tags.model"

export default interface TagsResponse extends BaseResponse {
  total?: number
  response?: TagsModel[]
}
