import logger from "~/configs/winston.config"

export class Logger {
  private readonly _noStackTrace: string = "No stack trace available!"
  private readonly _noMessage: string = "No message available!"

  public error = (err: Error) => {
    logger.log({
      level: "error",
      message: err.message ?? this._noMessage,
      stack: err.stack ?? this._noStackTrace,
    })
  }
}
