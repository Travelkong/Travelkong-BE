import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type { PostLikes } from "./interfaces/postLikes.interface"
import z from "zod"

export default class LikesValidator {
  public validatePostLike(payload: PostLikes) {
    const schema = z.object({
      postId: z.string().uuid(),
      commentId: z.never().optional(), // Unsure why never has to be optional to work.
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateCommentLike(payload: CommentLikes) {
    const schema = z.object({
      postId: z.never().optional(),
      commentId: z.string().uuid(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
