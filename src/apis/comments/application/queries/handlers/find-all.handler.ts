import type Comment from "~/apis/comments/domain"
import type { CommentsRepository } from "~/apis/comments/infrastructure"
import type { Logger } from "~/miscs/logger"
import type { FindAllQuery } from "../find-all.query"

export class FindAllHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(_: FindAllQuery): Promise<Comment[] | undefined> {
    try {
      const response = await this._repository.findAll()
      return response ?? undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
