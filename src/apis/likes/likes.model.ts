import type BaseModel from "~/miscs/others/baseModel"
import type { PostLikes } from "./interfaces/userLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"

// postId and commentId are optional fields, but either one of them must exists.
type LikesModel = {
    id: string
    userId: string
} & (PostLikes | CommentLikes) & BaseModel

export default LikesModel
