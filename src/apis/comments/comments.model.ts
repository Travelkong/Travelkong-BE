import type BaseModel from "~/miscs/others/baseModel"

type commentStatus = "created" | "updated" | "deleted"

export default interface CommentsModel extends BaseModel {
  id: string
  parentCommentId?: string
  postId: string
  userId: string
  comment: string
  images?: string
  status: commentStatus
}
