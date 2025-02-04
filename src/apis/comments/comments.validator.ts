import z from "zod";

export default class CommentsValidator {
  public validateId(id: string) {
    const schema = z.string().uuid().nonempty()

    const result = schema.safeParse(id)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}
