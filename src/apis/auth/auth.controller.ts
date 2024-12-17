import type { Request, Response, NextFunction } from "express"

import { Logger } from "~/miscs/logger"
import type { LoginDTO, RegisterDTO } from "./auth.dto"
import { AuthValidator } from "./auth.validator"
import { RegisterService, LoginService } from "./auth.service"

const logger = new Logger()

export const RegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload: RegisterDTO = req.body

    const authValidator = new AuthValidator()
    const validationError = authValidator.Register(payload)

    if (validationError) {
      res.status(400).json({ message: validationError })
      return
    }

    const response = await RegisterService(payload)
    if (!response?.error) {
      res.status(response?.statusCode as number).json({ message: "User registered successfully" })
    } else {
      res.status(response.statusCode).json({ message: response.message })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error)
      next(error)
    }
  }
}

export const LoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload: LoginDTO = req.body

    const authValidator = new AuthValidator()
    const validationError = authValidator.Login(payload)
    if (validationError) {
      res.status(400).json({ message: validationError })
      return
    }

    const response = await LoginService(payload)
    if (!response?.error) {
      res.status(response?.statusCode as number).json({ message: "Login successfully.", data: response?.data })
    } else {
      res.status(response?.statusCode).json({ message: "Incorrect username, email, or password!" })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error)
      next(error)
    }
  }
}