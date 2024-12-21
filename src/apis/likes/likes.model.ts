import type BaseModel from "~/miscs/others/baseModel"
import type { PostLikes } from "./interfaces/postLikes.interface"
import type { CommentLikes } from "./interfaces/commentLikes.interface"

// postId and commentId are optional fields, but either one of them must exists.
type LikesModel = {
  id: string
  userId: string
} & (PostLikes | CommentLikes) &
  BaseModel

export default LikesModel
