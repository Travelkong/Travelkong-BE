import z from "zod"
import type { UpdateUserDTO } from "./user.dto"

export default class UserValidator {
  public update(payload: UpdateUserDTO) {
    const schema = z
      .object({
        email: z.union([z.string().email(), z.string(), z.undefined()]),
        password: z.union([z.string().min(8), z.undefined()]),
        profile_picture: z.union([z.string(), z.undefined()]),
        address: z.union([z.string(), z.undefined()]),
      })
      .strict()

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
