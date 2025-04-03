import z from "zod"

export default class TagsValidator {
  public validateTagName(payload: string) {
    const schema = z.string().nonempty()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateTagId(payload: string) {
    const schema = z.string().nanoid().nonempty()

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }
}
