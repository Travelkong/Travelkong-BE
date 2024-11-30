import { Logger } from "~/miscs/logger"
import { LoginDTO, RegisterDTO } from "./auth.dto"
import { AuthValidator } from "./auth.validator"
import { RegisterService } from "./auth.service"
import { Request, Response, NextFunction } from "express"

const logger = new Logger()

export const RegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload: RegisterDTO = req.body as unknown as RegisterDTO
    const authValidator = new AuthValidator()
    const error = authValidator.Register(payload)
    if (error) return console.error(error)

    const response = await RegisterService(payload)
  } catch (error: any) {
    logger.error(error)
  }
}
