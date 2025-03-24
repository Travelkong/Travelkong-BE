import type BaseModel from "~/miscs/others/baseModel"

export interface PostsModel extends BaseModel {
  id: string
  userId: string
  postContentId: string
  tags: string[]
  likesCount: number
  commentsCount: number
  viewsCount: number
}
