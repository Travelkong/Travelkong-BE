import type { LoginDTO, RegisterDTO } from "./auth.dto"
import { z } from "zod"

export default class AuthValidator {
  public register(payload: RegisterDTO) {
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
    }

    return null
  }

  public login(payload: LoginDTO) {
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
        // Prevents both username and password from appearing in a request.
        if (data.username && data.email) {
          ctx.addIssue({
            code: "custom",
            path: ["username", "email"],
            message: "Please do not include both username and email in a request."
          })
        } else if (data.email) {
          const result = emailSchema.safeParse(data)
          if (!result.success) {
            for (const issue of result.error.errors) {
              ctx.addIssue({
                ...issue,
                path: ["email"],
              })
            }

            return ctx
          }
        } else if (data.username) {
          const result = usernameSchema.safeParse(data)
          if (!result.success) {
            for (const issue of result.error.errors) {
              ctx.addIssue({
                ...issue,
                path: ["username"],
              })
            }

            return ctx
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
