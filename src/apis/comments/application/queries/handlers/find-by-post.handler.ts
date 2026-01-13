import type Comment from "~/apis/comments/domain"
import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { FindByPostQuery } from "../find-by-post.query"

export class FindByPostHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(query: FindByPostQuery): Promise<Comment[] | undefined> {
    try {
      const response = await this._repository.findByPost(query.id)
      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
