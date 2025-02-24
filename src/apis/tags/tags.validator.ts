import z from "zod"

export default class TagsValidator {
  public validateTagName(payload: string) {
    const schema = z.string().nonempty()

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateTagId(payload: string) {
    const schema = z.string().nanoid().nonempty()

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
