import z from "zod"

export default class UserValidator {
  public validateId(payload: string) {
    const schema = z.string().nonempty()

    const result = schema.safeParse(payload)
    if (!result.success) {
        return result.error.errors
    }

    return null
  }
}
