import winston, { format, transports } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import { existsSync, mkdirSync } from "fs"
import path from "path"

const logDirectory: string = "logs"

if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory, { recursive: true })
}

const logger: winston.Logger = winston.createLogger({
  defaultMeta: { service: "user-service" },
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize({ all: true }),

    format.printf((log: winston.Logform.TransformableInfo) => {
      if (log.stack)
        return `[${log.timestamp}] [${log.level}] [${log.stack as string}]`
      return `[${log.timestamp}] [${log.level}] ${log.message}`
    }),
  ),

  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((log: winston.Logform.TransformableInfo) => {
          return `[${log.timestamp}] [${log.level}] [${log.message}]`
        }),
      ),
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: format.json(),
    }),
  ],
})

logger.exceptions.handle(
  new transports.File({ filename: path.join(logDirectory, "exceptions.log") }),
)

logger.exceptions.handle(
  new transports.File({ filename: path.join(logDirectory, "rejections.log") }),
)

export default logger
