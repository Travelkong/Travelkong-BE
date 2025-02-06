import type BaseModel from "~/miscs/others/baseModel"

type commentStatus = "created" | "updated" | "deleted"

export interface CommentModel extends BaseModel {
  id: string
  parent_comment_id?: string
  post_id: string
  user_id: string
  comment: string
  images?: string
  status: commentStatus
}
