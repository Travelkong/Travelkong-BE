import postgresqlConnection from "~/configs/postgresql.config"
import type { Logger } from "~/miscs/logger"
import type { PostsModel } from "../posts/posts.model"
import type { SearchResult } from "./search.response"

export default class SearchRepository {
  constructor(private readonly _logger: Logger) {}

  public searchPosts = async (
    query: string,
    page: number,
    limit: number,
    offset: number,
  ): Promise<SearchResult | undefined> => {
    let total = 0
    let totalPages = 0
    let postResult: PostsModel[] = []
    try {
      const searchQuery = "SELECT * FROM search_post_and_count($1, $2, $3)"
      const response = await postgresqlConnection.query(searchQuery, [
        query,
        limit,
        offset,
      ])

      if (response.rows.length > 0) {
        const { result: posts, count: postCount } = response.rows[0]
        postResult = posts ?? []
        total = postCount as number
        totalPages = Math.ceil(total / limit)
      }

      return {
        posts: postResult,
        pagination: {
          totalResults: total,
          totalPages: totalPages,
          currentPage: page,
          limit: limit,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }
}
