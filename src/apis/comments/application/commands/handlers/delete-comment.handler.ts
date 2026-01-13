import { CommentStatus } from './../../../domain/comment-status.policy';
import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { DeleteCommentCommand } from "../delete-comment.command"

export class DeleteCommentHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(
    command: DeleteCommentCommand,
  ): Promise<boolean | undefined> {
    try {
      let response: boolean | undefined
      const status = CommentStatus.deleted
      
      if (command.isAdmin) {
        response = await this._repository.adminDelete(command.id)
      } else {
        response = await this._repository.delete(command.id, status)
      }

      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }
      throw error
    }
  }
}
