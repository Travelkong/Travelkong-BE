import z from "zod";
import type CommentsModel from "./comments.model";
import type { UpdateCommentDTO } from "./comments.dto";

export default class CommentsValidator {
  public validateAddComment(payload: CommentsModel) {
    const schema = z.object({
      parentCommentId: z.union([z.string().nanoid(), z.string()]).optional(),
      postId: z.string().nanoid(),
      comment: z.string().nonempty(),
      images: z.string().array().or(z.string()).nullable().optional()
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateUpdateComment(payload: UpdateCommentDTO) {
    const schema = z.object({
      id: z.string().nanoid(),
      comment: z.string().nonempty(),
      images: z.string().array().or(z.string()).nullable().optional()
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateId(id: string) {
    const schema = z.string().nanoid().nonempty()

    const response = schema.safeParse(id)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }
}
