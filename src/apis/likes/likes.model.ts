import BaseModel from "~/miscs/others/baseModel"
import { PostLikes } from "./interfaces/userLikes.interface"
import { CommentLikes } from "./interfaces/commentLikes.interface"

// postId and commentId are optional fields, but either one of them must exists.
export type LikesModel = {
    id: string
    userId: string
} & (PostLikes | CommentLikes) & BaseModel


