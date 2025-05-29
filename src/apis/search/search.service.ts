import type PaginationService from "@core/services/pagination"
import type SearchRepository from "./search.repository"
import type SearchPostDTO from "./dtos/search.dto"
import type { Logger } from "~/miscs/logger"
import type SearchResponse from "./search.response"
import { HTTP_STATUS } from "~/miscs/utils"

export default class SearchService {
  constructor(
    private readonly _logger: Logger,
    private readonly _searchRepository: SearchRepository,
  ) {}

  public searchPosts = async (
    queries: SearchPostDTO,
    pagination: PaginationService,
  ): Promise<SearchResponse | undefined> => {
    let { q: query, page, limit } = queries
    const { offset } = pagination
    try {
      // "Sanitizes" the query since it could sometimes only contains q.
      if (typeof page === "undefined" || page <= 0)
        page = pagination.currentPage
      if (typeof limit === "undefined" || limit <= 0) limit = pagination.limit

      const response = await this._searchRepository.searchPosts(
        query,
        page,
        limit,
        offset,
      )

      if (!response?.pagination) {
        return {
          posts: [],
          pagination: {
            totalResults: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 10,
          },
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const paginate = response.pagination
      if (paginate?.totalResults === 0) {
        return {
          posts: [],
          pagination: {
            totalResults: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 10,
          },
          statusCode: HTTP_STATUS.NO_CONTENT.code,
          message: HTTP_STATUS.NO_CONTENT.message,
        }
      }

      pagination.setTotal(paginate.totalResults)
      if (paginate?.totalResults > 0) {
        return {
          posts: response?.posts,
          pagination: {
            totalResults: paginate?.totalResults,
            totalPages: paginate?.totalPages,
            currentPage: paginate?.currentPage,
            limit: paginate?.limit,
          },

          statusCode: HTTP_STATUS.OK.code,
          message: HTTP_STATUS.OK.message,
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
