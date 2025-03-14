import type BaseModel from "~/miscs/others/baseModel"

type commentStatus = "created" | "updated" | "deleted"

export default interface CommentsModel extends BaseModel {
  id: string
  parentCommentId?: string | null
  postId: string
  userId: string
  comment: string
  images?: string | string[]
  level: number
  status: commentStatus
}
