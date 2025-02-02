import z from "zod"
import type { UpdateUserDTO } from "./user.dto"

export default class UserValidator {
  public update(payload: UpdateUserDTO) {
    const schema = z.object({
      email: z.string().email().nonempty(),
      password: z.string().nonempty(),
      profile_picture: z.string().nonempty(),
      address: z.string().nonempty(),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }

  public validateId(payload: string) {
    const schema = z.string().nonempty()

    const result = schema.safeParse(payload)
    if (!result.success) {
        return result.error.errors
    }

    return null
  }
}
