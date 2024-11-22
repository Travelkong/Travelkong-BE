import BaseModel from "~/miscs/others/baseModel"

export interface CommentModel extends BaseModel {
  id: number
  parent_comment_id?: number
  post_id: number
  user_id: string
  username: string
  user_profile_picture: string
  comment: string
  images?: string
}
