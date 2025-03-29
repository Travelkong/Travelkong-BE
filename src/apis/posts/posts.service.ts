import TagsRepository from "../tags/tags.repository"
import PostsRepository from "./posts.repository"
import { Logger } from "~/miscs/logger"
import { generateId } from "~/miscs/helpers"
import type { AddPostDTO } from "./interfaces/postContent.dto"
import type { BaseResponse } from "~/miscs/others"
import { HTTP_STATUS } from "~/miscs/utils"

export default class PostsService {
  readonly #postsRepository: PostsRepository
  readonly #tagsRepository: TagsRepository
  readonly #logger: Logger

  constructor() {
    this.#postsRepository = new PostsRepository()
    this.#tagsRepository = new TagsRepository()
    this.#logger = new Logger()
  }

  public get = async (id: string): Promise<BaseResponse | undefined> => {
    try {
      const response = await this.#postsRepository.get(id)
      if (response) {
        return {
          statusCode: 200,
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public getAll = async (): Promise<BaseResponse | undefined> => {
    try {
      const response = await this.#postsRepository.getAll()
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }

  public addPost = async (
    userId: string,
    postContent: AddPostDTO,
  ): Promise<BaseResponse | undefined> => {
    // TODO: This probably have violated the single responsibility principle.
    let { tags } = postContent
    if (!tags) tags = []
    try {
      const postContentId = await this.addPostContent(postContent)
      if (!postContentId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const id = generateId()
      const postId = await this.#postsRepository.addPost(
        id,
        userId,
        postContentId,
        tags,
      )

      if (!postId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      // Finds tag ID(s) (and inserts if not exists).
      const tagIds: string[] = []
      for (const tag of tags) {
        const tagResult = await this.#tagsRepository.findByName(tag)

        // Insert if there's no tag with that name
        if (!tagResult) {
          const tagId = generateId()
          const insertTagResult = await this.#tagsRepository.add(tagId, tag)
          if (!insertTagResult)
            throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)
          
          tagIds.push(tagId)
        } else {
          tagIds.push(tagResult.id)
        }
      }

      let response: boolean | undefined
      for (const tagId of tagIds) {
        response = await this.#postsRepository.addPostTags(postId, tagId)
        // Breaks if response is falsy or undefined (which shouldn't be happening anyway.)
        if (!response) break
      }

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
