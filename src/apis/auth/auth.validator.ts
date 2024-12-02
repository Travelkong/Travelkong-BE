import { LoginDTO, RegisterDTO } from "./auth.dto"
import { z } from "zod"

export class AuthValidator {
  public Register(payload: RegisterDTO) {
    const schema = z.object({
      username: z.string().regex(/^[a-zA-Z_]+$/),
      email: z.string().email(),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters!" }),
    })

    const result = schema.safeParse(payload)
    if (!result.success) {
      return result.error.errors
    } else {
      return null
    }
  }

  public Login(payload: LoginDTO) {
    // Refer to this answer: https://github.com/colinhacks/zod/issues/61#issuecomment-1297685465
    const emailSchema = z.object({
      email: z.string().email(),
    })

    const usernameSchema = z.object({
      username: z.string().regex(/^[a-zA-Z_]+$/),
    })

    const mainSchema = z
      .object({
        password: z.string(),
      })
      .merge(emailSchema.partial())
      .merge(usernameSchema.partial())
      .superRefine((data, ctx) => {
        if (data.email) {
          const result = emailSchema.safeParse(data)
          if (!result.success) {
            return result.error.errors.forEach((issue) =>
              ctx.addIssue({
                ...issue,
                path: ["email"],
              }),
            )
          }
        } else if (data.username) {
          const result = usernameSchema.safeParse(data)
          if (!result.success) {
            return result.error.errors.forEach((issue) =>
              ctx.addIssue({
                ...issue,
                path: ["username"],
              }),
            )
          }
        } else {
          ctx.addIssue({
            code: "custom",
            path: ["username", "email"],
            message: "Username or password is required!",
          })
        }
      })

    // This part makes the error message appears twice, but removing it "breaks" the validation.
    // i.e., an invalid email address would be accepted as if it is a valid one.
    const result = mainSchema.safeParse(payload)

    if (!result.success) {
      return result.error.errors.map((error: z.ZodIssue) => ({
        code: error.code,
        path: error.path,
        message: error.message,
      }))
    }

    return null
  }
}
