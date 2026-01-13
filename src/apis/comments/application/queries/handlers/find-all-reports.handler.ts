import type { Logger } from "~/miscs/logger";
import type { FindAllReportsQuery } from "../index";
import type { CommentsRepository } from "~/apis/comments/infrastructure";

export class FindAllReportsHandler {
  constructor(private readonly _logger: Logger, private readonly _repository: CommentsRepository) {}

  public async execute(_: FindAllReportsQuery) {
    try {
        const response = await this._repository.findAllReports()
        return response ?? undefined
    } catch(error) {
        if (error instanceof Error) {
            this._logger.error(error)
        }

        throw error
    }
  }
}
