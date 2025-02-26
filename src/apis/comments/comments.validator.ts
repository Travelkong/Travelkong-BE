import z from "zod";
import type CommentsModel from "./comments.model";
import type { UpdateCommentsDTO } from "./comments.dto";

export default class CommentsValidator {
  public validateAddComment(payload: CommentsModel) {
    const schema = z.object({
      parentCommentId: z.string().nanoid().nullable(),
      postId: z.string(),
      comment: z.string().nonempty(),
      images: z.string().array().or(z.string()).nullable()
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateUpdateComment(payload: UpdateCommentsDTO) {
    const schema = z.object({
      id: z.string(),
      comment: z.string().nonempty(),
      images: z.string().array().or(z.string()).nullable()
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateId(id: string) {
    const schema = z.string().nanoid().nonempty()

    const result = schema.safeParse(id)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
