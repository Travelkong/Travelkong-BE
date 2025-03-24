import PostsRepository from "./posts.repository"
import { Logger } from "~/miscs/logger"
import { generateId } from "~/miscs/helpers"
import type { AddPostDTO } from "./interfaces/postContent.dto"
import type { BaseResponse } from "~/miscs/others"

export default class PostsService {
  readonly #postsRepository: PostsRepository
  readonly #logger: Logger

  constructor() {
    this.#postsRepository = new PostsRepository()
    this.#logger = new Logger()
  }

  public addPost = async (
    userId: string,
    postContent: AddPostDTO,
  ): Promise<BaseResponse | undefined> => {
    const { tags } = postContent
    try {
      const postContentId = await this.addPostContent(postContent)
      if (!postContentId) {
        return {
          statusCode: 500,
          message: "Internal server error",
        }
      }

      const id = generateId()

      const response = await this.#postsRepository.addPost(
        id,
        userId,
        postContentId,
        tags,
      )
      if (response) {
        return {
          statusCode: 201,
          message: "Post created successfully.",
        }
      }

      return {
        statusCode: 500,
        message: "Internal server error.",
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  private readonly addPostContent = async (
    postContent: AddPostDTO,
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const postContentId = this.#postsRepository.addPostContent(
        postContent,
        id,
      )

      return postContentId
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}
