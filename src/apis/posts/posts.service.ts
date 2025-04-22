import { generateId } from "~/miscs/helpers"
import { HTTP_STATUS } from "~/miscs/utils"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"
import type { BaseResponse } from "~/miscs/others"
import type TagsRepository from "../tags/tags.repository"
import type PostsRepository from "./posts.repository"
import type { Logger } from "~/miscs/logger"
import UpdateBuilder from "~/miscs/utils/sql/updateBuilder"

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

  public getPostHistory = async (
    postId: string,
  ): Promise<BaseResponse | undefined> => {
    try {
      const response = await this._postsRepository.getPostHistory(postId)
      if (response) {
        return {
          statusCode: HTTP_STATUS.OK.code,
          message: HTTP_STATUS.OK.message,
          data: response,
        }
      }

      if (response) {
        return {
          statusCode: HTTP_STATUS.NO_CONTENT.code,
          message: HTTP_STATUS.NO_CONTENT.message,
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
      const postContentId = await this._addPostContent(postContent)
      if (!postContentId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const postId = await this._addPost(userId, postContentId)
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

      const response = await this._addPostTags(postId, postContent.tags)
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
  private readonly _addPostContent = async (
    postContent: AddPostDTO,
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const postContentId = await this._postsRepository.addPostContent(
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
  private readonly _addPost = async (
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
   * @param {string} postId
   * @param {string[]} tags
   * @returns
   */
  private readonly _addPostTags = async (
    postId: string,
    tags: string[],
  ): Promise<boolean | undefined> => {
    try {
      // Finds tag ID(s) (and inserts if not exists).
      const tagIds: string[] = []
      for (const tag of tags) {
        const tagResponse = await this._tagsRepository.findByName(tag)

        // Insert if there's no tag with that name
        if (!tagResponse) {
          const tagId = generateId()
          const insertTagResponse = await this._tagsRepository.add(tagId, tag)
          if (!insertTagResponse)
            throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)

          tagIds.push(tagId)
        } else {
          tagIds.push(tagResponse.id)
        }
      }

      let response: boolean | undefined
      for (const tagId of tagIds) {
        response = await this._postsRepository.addPostTags(postId, tagId)
        // Breaks if response is falsy or undefined.
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

  public edit = async (
    payload: EditPostDTO,
    userId: string,
  ): Promise<BaseResponse | undefined> => {
    const { id: postId, title, coverImageUrl, body, images } = payload
    const imageList: string = JSON.stringify(images)
    try {
      const postData = await this._postsRepository.get(postId)
      if (!postData) {
        return {
          statusCode: HTTP_STATUS.NOT_FOUND.code,
          message: HTTP_STATUS.NOT_FOUND.message,
        }
      }

      const postContentId: string = postData.post_id

      const queryBuilder = new UpdateBuilder()
        .from("post_contents")
        .set("title", title)
        .set("body", body)
      if (coverImageUrl) queryBuilder.set("cover_image_url", coverImageUrl)
      if (images) queryBuilder.set("images", imageList)
      queryBuilder.where("id", "=", postContentId)

      const { query, values } = queryBuilder.build()
      const response = await this._postsRepository.edit(query, values)
      if (response === undefined) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      if (response === false) {
        return {
          statusCode: HTTP_STATUS.NOT_MODIFIED.code,
          message: HTTP_STATUS.NOT_MODIFIED.message,
        }
      }

      return {
        statusCode: HTTP_STATUS.OK.code,
        message: HTTP_STATUS.OK.message,
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  /**
   * Edit tags in a post.
   * @param postTags
   * @returns {Promise<BaseResponse | undefined>}
   */
  public tags = async (
    postId: string,
    tags: string[],
  ): Promise<BaseResponse | undefined> => {
    let response: boolean | undefined
    try {
      const existingTags = await this._tagsRepository.getPostTags(postId)

      // If the post has no tag, inserts them.
      if (!existingTags) {
        response = await this._addPostTags(postId, tags)

        if (response) {
          return {
            statusCode: HTTP_STATUS.OK.code,
            message: HTTP_STATUS.OK.message,
          }
        }

        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      // Inserts and deletes the difference between the existing tags and the updated one.
      // The updated version is tags, i.e., the one that decides which tags is going to be inserted or removed.
      const toInsert = tags.filter((item) => !existingTags.includes(item))
      const toDelete = tags.filter((item) => !tags.includes(item))

      if (!toInsert && !toDelete) {
        return {
          statusCode: HTTP_STATUS.NO_CONTENT.code,
          message: HTTP_STATUS.NO_CONTENT.message,
        }
      }

      if (toInsert) {
        response = await this._addPostTags(postId, toInsert)
      }

      if (toDelete) {
        response = await this._deletePostTags(toDelete)
      }

      if (response) {
        return {
          statusCode: HTTP_STATUS.OK.code,
          message: HTTP_STATUS.OK.message,
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

  private readonly _deletePostTags = async (
    tags: string[],
  ): Promise<boolean | undefined> => {
    try {
      let response: boolean | undefined
      for (const tag of tags) {
        response = await this._postsRepository.deletePostTags(tag)
        // Breaks if response is falsy or undefined.
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

  public delete = async () => {}
}
