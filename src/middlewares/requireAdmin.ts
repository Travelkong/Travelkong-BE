import postgresqlConnection from "~/configs/postgresql.config"
import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "./jwt"
import { Logger } from "~/miscs/logger"
import { ROLE } from "~/miscs/others"
import { HTTP_STATUS } from "~/miscs/utils"

const logger = new Logger()

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const queryString = "SELECT user_role($1) as role"
    const response = await postgresqlConnection.query(queryString, [userId])

    if (response.rows[0].role !== ROLE.ADMIN) {
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
