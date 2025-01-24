import logger from "~/configs/winston.config"

export class Logger {
  private readonly _noStackTrace: string = "No stack trace available!"
  private readonly _noMessage: string = "No message available!"

  public error = (error: Error) => {
    logger.log({
      level: "error",
      message: error.message ?? this._noMessage,
      stack: error.stack ?? this._noStackTrace,
    })
  }
}
