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

    return schema.parse(payload)
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
        password: z
          .string()
          .min(8, { message: "Password must be at least 8 characters." }),
      })
      .merge(emailSchema.partial())
      .merge(usernameSchema.partial())
      .superRefine((data, ctx) => {
        if (data.email) {
          const result = emailSchema.safeParse(data)
          if (!result.success) {
            result.error.errors.forEach((issue) => ctx.addIssue(issue))
          }
        } else if (data.username) {
          const result = usernameSchema.safeParse(data)
          if (!result.success) {
            result.error.errors.forEach((issue) => ctx.addIssue(issue))
          }
        } else {
          ctx.addIssue({
            code: "custom",
            path: ["username", "email"],
            message: "Username or password is required!",
          })
        }
      })

      return mainSchema.parse(payload)
  }
}
