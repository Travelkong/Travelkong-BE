import type { CommentLikes } from "./interfaces/commentLikes.interface"
import type { PostLikes } from "./interfaces/postLikes.interface"
import z from "zod"

export default class LikesValidator {
  public validatePostLike(payload: PostLikes) {
    const schema = z.object({
      postId: z.string().nanoid().nonempty(),
      commentId: z.never().optional(), // Unsure why never has to be optional to work.
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateCommentLike(payload: CommentLikes) {
    const schema = z.object({
      postId: z.never().optional(),
      commentId: z.string().nanoid().nonempty(),
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateId(payload: string) {
    const schema = z.string().nanoid().nonempty()
    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }
}
