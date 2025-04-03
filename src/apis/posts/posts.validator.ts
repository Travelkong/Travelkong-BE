import z from "zod"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"

export default class PostsValidator {
  public validateId(payload: string) {
    const schema = z.string().nanoid()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validatePostContent(payload: AddPostDTO) {
    const schema = z.object({
      title: z.string().nonempty(),
      coverImageUrl: z.union([z.string(), z.undefined()]),
      body: z.string().nonempty(),
      images: z.union([z.array(z.string()), z.string(), z.undefined()]),
      tags: z.union([z.array(z.string().min(1)), z.string().min(1), z.undefined()]),
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
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

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }
}
