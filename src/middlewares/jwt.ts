import jwt, { TokenExpiredError } from "jsonwebtoken"
import dotenv from "dotenv"
import type { Request, Response, NextFunction } from "express"
import { HTTP_STATUS } from "~/miscs/utils"
import EnvConfig from "~/configs/env.config"
import { ROLE } from "~/miscs/others"
import { Logger } from "~/miscs/logger"

dotenv.config()

interface User {
  userId: string
  email: string
  role: string
}

const logger = new Logger()

export default class JwtMiddleware {
  public static readonly verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<unknown, Record<string, unknown>> | undefined => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED.code)
        .json({ message: "Access token required!" })
    }

    const secretKey: string | undefined = EnvConfig.app.jwtAccessSecret
    if (!secretKey) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED.code)
        .json({ message: "Access token required" })
    }

    const secret = Buffer.from(secretKey, "base64")

    try {
      const decoded = jwt.verify(token, secret as jwt.Secret)
      req.user = decoded as User
      next()
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED.code)
          .json({ message: "Access token expired" })
      } else {
        return res
          .status(HTTP_STATUS.FORBIDDEN.code)
          .json({ message: "Invalid access token" })
      }
    }
  }

  public static readonly verifyRefreshToken = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<unknown, Record<string, unknown>> | undefined => {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED.code)
        .json({ message: "Refresh token required!" })
    }

    const secretKey: string | undefined = EnvConfig.app.jwtRefreshSecret
    if (!secretKey) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED.code)
        .json({ message: "Refresh token required" })
    }

    const secret = Buffer.from(secretKey, "base64")

    try {
      const decoded = jwt.verify(refreshToken, secret as jwt.Secret)
      req.user = decoded as User
      next()
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED.code)
          .json({ message: "Access token expired" })
      } else {
        return res
          .status(HTTP_STATUS.FORBIDDEN.code)
          .json({ message: "Invalid access token" })
      }
    }
  }

  // Note: Not to be confused with the helper function. This only works as a guard rail for protected routes.
  public static readonly isAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const role = req.user?.role
      if (role !== ROLE.ADMIN) {
        return res
          .status(HTTP_STATUS.FORBIDDEN.code)
          .json({ message: HTTP_STATUS.FORBIDDEN.message })
      }

      return next()
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
      }

      throw error
    }
  }
}
