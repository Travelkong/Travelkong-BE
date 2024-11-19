import BaseModel from "~/miscs/others/baseModel"
import { PostContentModel } from "./postContent.model"
import { CommentModel } from "../comment/comment.model"

export interface PostModel extends BaseModel {
    id: string
    user_id: string
    post_content: PostContentModel
    liked: boolean
    likes_count: number
    comments?: CommentModel[]
    comments_count: number
    views_count: number
}