import type Comment from "~/apis/comments/domain"
import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { FindOneQuery } from "../find-one.query"

export class FindOneHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(query: FindOneQuery): Promise<Comment | undefined> {
    try {
      const response = await this._repository.findOne(query.id)
      if (!response) {
        return undefined
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
