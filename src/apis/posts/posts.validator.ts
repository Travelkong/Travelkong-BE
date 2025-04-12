import z from "zod"
import type { AddPostDTO, EditPostDTO, EditPostTagsDTO } from "./interfaces/postContent.dto"

export default class PostsValidator {
  public validateId(payload: string) {
    const schema = z.string().nanoid()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public validatePostContent(payload: AddPostDTO) {
    const schema = z.object({
      title: z.string().nonempty(),
      coverImageUrl: z.union([z.string(), z.undefined()]),
      body: z.string().nonempty(),
      images: z.union([z.array(z.string()), z.string(), z.undefined()]),
      tags: z.union([
        z.array(z.string().min(1)),
        z.string().min(1),
        z.undefined(),
      ]),
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public validateEditPost(payload: EditPostDTO) {
    const schema = z.object({
      id: z.string().nanoid(),
      title: z.string().nonempty(),
      coverImageUrl: z.union([z.string(), z.undefined()]),
      body: z.string().nonempty(),
      images: z.union([z.array(z.string()), z.undefined()]),
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public validateTags(payload: EditPostTagsDTO) {
    const schema = z.object({
      postId: z.string().nanoid(),
      tags: z.array(z.string().nanoid()),
    })

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }
}
