import Comment, { CommentStatus } from "~/apis/comments/domain"
import { generateId } from "~/miscs/helpers"
import type { Logger } from "~/miscs/logger"
import type { AddCommentCommand } from ".."
import type { CommentsRepository } from "../../../infrastructure"

export class AddCommentHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(
    command: AddCommentCommand,
  ): Promise<boolean | undefined> {
    let level: number = 0
    const id = generateId()
    const images = Array.from(JSON.stringify(command.images))

    try {
      // Checks comment level (the hierarchy comments (I have no idea what it is called
      // nor how to explain it, but it is kinda like what reddit does), maximum 5).
      if (command.parentCommentId) {
        const parentCommentLevel = await this._repository.commentLevel(
          command.parentCommentId,
        )

        level = Math.min(parentCommentLevel + 1, 5)
      }

      const comment = new Comment(
        id,
        command.postId,
        command.userId,
        command.content,
        level,
        CommentStatus.created,
        command?.parentCommentId,
        images,
      )

      const response = await this._repository.add(comment)
      if (!response) {
        throw new Error("An error has occurred!")
      }

      return response
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
