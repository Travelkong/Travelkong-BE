import type Comment from "~/apis/comments/domain"
import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { FindByUserQuery } from "../find-by-user.query"

export class FindByUserHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public execute = async (
    query: FindByUserQuery,
  ): Promise<Comment[] | undefined> => {
    try {
      const response = await this._repository.findByUser(query.id)
      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
