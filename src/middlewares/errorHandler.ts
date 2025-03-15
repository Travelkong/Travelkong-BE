import type { Request, Response, NextFunction } from "express"

import { Logger } from "~/miscs/logger"
import { CustomError } from "~/miscs/others"

const logger = new Logger()

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof CustomError) {
    logger.error(error)

    const statusCode = error.statusCode || 500
    res
      .status(statusCode)
      .json({ message: error.message || "Internal server error" })
  } else {
    logger.error(new Error(String(error)))
  }

  res.status(500).json({ error: "Internal server error" })
}

export default errorHandler
