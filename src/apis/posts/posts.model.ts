import type BaseModel from "~/miscs/others/baseModel"

export interface PostsModel extends BaseModel {
  post_id: string
  user_id: string
  post_content_id: string
  title: string
  cover_image_url: string
  body: string
  images: string[]
  tags: { tag_id: string, tag_name: string}[]
  likes_count: number
  comments_count: number
  views_count: number
}
