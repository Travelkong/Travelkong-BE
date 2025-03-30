import { generateId } from "~/miscs/helpers"
import { HTTP_STATUS } from "~/miscs/utils"
import type { AddPostDTO } from "./interfaces/postContent.dto"
import type { BaseResponse } from "~/miscs/others"
import type TagsRepository from "../tags/tags.repository"
import type PostsRepository from "./posts.repository"
import type { Logger } from "~/miscs/logger"

export default class PostsService {
  constructor(
    private readonly _logger: Logger,
    private readonly _postsRepository: PostsRepository,
    private readonly _tagsRepository: TagsRepository,
  ) {}

  public get = async (id: string): Promise<BaseResponse | undefined> => {
    try {
      const response = await this._postsRepository.get(id)
      if (response) {
        return {
          statusCode: HTTP_STATUS.OK.code,
          message: HTTP_STATUS.OK.message,
          data: response,
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public getAll = async (): Promise<BaseResponse | undefined> => {
    try {
      const response = await this._postsRepository.getAll()
      if (response) {
        return {
          statusCode: HTTP_STATUS.OK.code,
          message: HTTP_STATUS.OK.message,
          data: response
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  public add = async (
    userId: string,
    postContent: AddPostDTO,
  ): Promise<BaseResponse | undefined> => {
    try {
      const postContentId = await this.addPostContent(postContent)
      if (!postContentId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const postId = await this.addPost(userId, postContentId)
      if (!postId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      if (!postContent.tags)
        return {
          statusCode: HTTP_STATUS.CREATED.code,
          message: HTTP_STATUS.CREATED.message,
        }

      const response = await this.addPostTags(postId, postContent.tags)
      if (response) {
        return {
          statusCode: HTTP_STATUS.CREATED.code,
          message: HTTP_STATUS.CREATED.message,
        }
      }

      return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
        message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  /**
   * Creates the main content of a post.
   * @param {AddPostDTO} postContent
   * @returns {string}
   */
  private readonly addPostContent = async (
    postContent: AddPostDTO,
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const postContentId = this._postsRepository.addPostContent(
        postContent,
        id,
      )

      return postContentId
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  /**
   * Creates the metadata for a post
   * @param {string} userId
   * @param {string} postContentId
   * @returns {string}
   */
  private readonly addPost = async (
    userId: string,
    postContentId: string,
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const response = await this._postsRepository.addPost(
        id,
        userId,
        postContentId,
      )

      return response
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  /**
   * Creates tag(s) for a post.
   * @param postId
   * @param tags
   * @returns
   */
  private readonly addPostTags = async (
    postId: string,
    tags: string[],
  ): Promise<boolean | undefined> => {
    try {
      // Finds tag ID(s) (and inserts if not exists).
      const tagIds: string[] = []
      for (const tag of tags) {
        const tagResult = await this._tagsRepository.findByName(tag)

        // Insert if there's no tag with that name
        if (!tagResult) {
          const tagId = generateId()
          const insertTagResult = await this._tagsRepository.add(tagId, tag)
          if (!insertTagResult)
            throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)

          tagIds.push(tagId)
        } else {
          tagIds.push(tagResult.id)
        }
      }

      let response: boolean | undefined
      for (const tagId of tagIds) {
        response = await this._postsRepository.addPostTags(postId, tagId)
        // Breaks if response is falsy or undefined (which shouldn't be happening anyway.)
        if (!response) break
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
