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

    const response = schema.safeParse(payload)
    if (!response.success) {
      return response.error.errors
    }

    return null
  }

  public validateId(payload: string) {
    const schema = z.string().nonempty()

    const response = schema.safeParse(payload)
    if (!response.success) {
        return response.error.errors
    }

    return null
  }
}
