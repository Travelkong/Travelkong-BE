import type { BaseResponse } from "~/miscs/others"
import type { PostsModel } from "../posts/posts.model"

export default interface SearchResponse extends BaseResponse {
  posts: PostsModel[]
  pagination: {
    totalResults: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export type SearchResult = Pick<SearchResponse, "posts" | "pagination">
