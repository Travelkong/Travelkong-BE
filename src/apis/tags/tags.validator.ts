import z from "zod"

export default class TagsValidator {
  public validateTags(payload: string) {
    const schema = z.string()
    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
