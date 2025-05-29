import type { Request, Response, NextFunction } from "express"

import type SearchService from "./search.service"
import SearchPostDTO from "./dtos/search.dto"
import { HTTP_STATUS } from "~/miscs/utils"
import { plainToInstance } from "class-transformer"
import { validate, type ValidationError } from "class-validator"
import PaginationService from "@core/services/pagination"

export default class SearchController {
  constructor(private readonly _searchService: SearchService) {}

  public searchPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const queries: SearchPostDTO = plainToInstance(SearchPostDTO, req.query)

      const errors: ValidationError[] = await validate(queries)
      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json(errors)
      }

      if (queries.limit > PaginationService.maxLimit) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({
            message: `Limit cannot exceed ${PaginationService.maxLimit}`,
          })
      }

      const pagination = new PaginationService(queries.limit, queries.page)
      const response = await this._searchService.searchPosts(
        queries,
        pagination,
      )

      return res.status(response?.statusCode as number).json({
        message: response?.message,
        posts: response?.posts,
        pagination: {
          totalResults: response?.pagination?.totalResults,
          totalPages: response?.pagination?.totalPages,
          currentPage: response?.pagination?.currentPage,
          limit: response?.pagination?.limit,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}
