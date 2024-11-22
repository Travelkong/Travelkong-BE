import logger from "~/configs/winston.config"

export class Logger {
  private readonly noStackTrace: string = "No stack trace available!"
  private readonly noMessage: string = "No message available!"

  public error = (err: Error) => {
    logger.log({
      level: "error",
      message: err.message ?? this.noMessage,
      stack: err.stack ?? this.noStackTrace,
    })
  }
}
