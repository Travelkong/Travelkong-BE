import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { EditCommentCommand } from "../edit-comment.command"

export class EditCommentHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(
    command: EditCommentCommand,
  ): Promise<boolean | undefined> {
    try {
      const imagesUrl = Array.from(JSON.stringify(command.images))
      const status = "updated"

      const response = await this._repository.edit(
        command.id,
        command.content,
        status,
        imagesUrl,
      )

      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
