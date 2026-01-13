import type { CommentsRepository } from "~/apis/comments/infrastructure"
import { ReportResponse } from "~/apis/comments/presentation/dtos"
import type { Logger } from "~/miscs/logger"
import type { ResolveReportCommand } from "../"

export class ResolveReportHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _repository: CommentsRepository,
  ) {}

  public async execute(
    command: ResolveReportCommand,
  ): Promise<ReportResponse | undefined> {
    try {
      const isResolve = await this._repository.isResolved(command.id)
      if (isResolve === undefined) return ReportResponse.NotFound
      else if (isResolve) return ReportResponse.Existed

      const response = await this._repository.resolveReport(command.id)
      if (response) return ReportResponse.Updated

      return undefined
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
