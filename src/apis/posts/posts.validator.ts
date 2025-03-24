import z from "zod"
import type { AddPostDTO } from "./interfaces/postContent.dto"

export default class PostsValidator {
  public validatePostContent(payload: AddPostDTO) {
    const schema = z.object({
      title: z.string().nonempty(),
      coverImageUrl: z.string().nullable(),
      body: z.string().nonempty(),
      images: z.array(z.string()).nullable(),
      tags: z.array(z.string()).nullable(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
