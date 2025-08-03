import z from "zod"

export default class TagsValidator {
  public tagName(payload: string) {
    const schema = z.string().nonempty()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public tagId(payload: string) {
    const schema = z.string().nanoid().nonempty()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }
}
