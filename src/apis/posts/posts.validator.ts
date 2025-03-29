import z from "zod"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"

export default class PostsValidator {
  public validateId(payload: string) {
    const schema = z.string().nanoid()

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validatePostContent(payload: AddPostDTO) {
    const schema = z.object({
      title: z.string().nonempty(),
      coverImageUrl: z.string().nullable(),
      body: z.string().nonempty(),
      images: z.array(z.string()).nullable(),
      tags: z.array(z.string().nanoid()).nullable(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateEditPost(payload: EditPostDTO) {
    const schema = z.object({
      id: z.string().nanoid(),
      title: z.string().nonempty(),
      coverImageUrl: z.string().nullable(),
      body: z.string().nonempty(),
      images: z.array(z.string()).nullable(),
      tags: z.array(z.string().nanoid()).nullable(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
