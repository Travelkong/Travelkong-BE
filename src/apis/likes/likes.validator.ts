import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type { PostLikes } from "./interfaces/postLikes.interface"
import z from "zod"

export default class LikesValidator {
  public addPostLike(payload: PostLikes) {
    const schema = z.object({
      postId: z.string().uuid(),
      commentId: z.never(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public addCommentLike(payload: CommentLikes) {
    const schema = z.object({
      postId: z.never(),
      commentId: z.string().uuid(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
