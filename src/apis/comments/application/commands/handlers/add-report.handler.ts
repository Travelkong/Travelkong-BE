import type { CommentsRepository } from "~/apis/comments/infrastructure"
import { generateId } from "~/miscs/helpers"
import type { Logger } from "~/miscs/logger"
import type { AddReportCommand } from "../"

export class AddReportHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(
    command: AddReportCommand,
  ): Promise<boolean | undefined> {
    try {
      const id = generateId()
      const response = await this._repository.addReport(id, command.commentId, command.userId, command.reason)
      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
