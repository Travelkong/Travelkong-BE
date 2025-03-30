import type { Response, NextFunction } from "express"
import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import { ROLE } from "~/miscs/others"
import { HTTP_STATUS } from "~/miscs/utils"

const logger = new Logger()

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.userId
    const queryString = "SELECT role FROM users WHERE id = $1"
    const response = await postgresqlConnection.query(queryString, [userId])

    if (response[0].role !== ROLE.ADMIN) {
      return res
        .status(HTTP_STATUS.FORBIDDEN.code)
        .json({ message: HTTP_STATUS.FORBIDDEN.message })
    }

    next()
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error)
    }

    throw error
  }
}
