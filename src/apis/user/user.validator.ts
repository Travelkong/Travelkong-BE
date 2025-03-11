import z from "zod"
import type { UpdateUserDTO } from "./user.dto"

export default class UserValidator {
  public update(payload: UpdateUserDTO) {
    const schema = z.object({
      email: z.union([z.string().email(), z.string()]).optional(),
      password: z.string().optional(),
      profile_picture: z.string().optional(),
      address: z.string().optional(),
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
