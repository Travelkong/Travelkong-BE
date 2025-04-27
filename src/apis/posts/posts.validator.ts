import z from "zod"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"

export default class PostsValidator {
  public id(payload: string) {
    const schema = z.string().nanoid()
    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public postContent(payload: AddPostDTO) {
    const schema = z
      .object({
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
      .strict()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public edit(payload: EditPostDTO) {
    const schema = z
      .object({
        id: z.string().nanoid(),
        title: z.string().nonempty(),
        coverImageUrl: z.union([z.string(), z.undefined()]),
        body: z.string().nonempty(),
        images: z.union([z.array(z.string()), z.undefined()]),
      })
      .strict()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }

  public tags(payload: string[]) {
    const schema = z.union([z.array(z.string().min(1)), z.string().min(1)])

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }
  }
}
