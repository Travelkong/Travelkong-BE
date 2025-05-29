import { generateId } from "~/miscs/helpers"
import { HTTP_STATUS } from "~/miscs/utils"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"
import type { BaseResponse } from "~/miscs/others"
import type TagsRepository from "../tags/tags.repository"
import type PostsRepository from "./posts.repository"
import type { Logger } from "~/miscs/logger"
import UpdateBuilder from "~/miscs/utils/sql/updateBuilder"
import InsertBuilder from "~/miscs/utils/sql/insertBuilder"

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
      const postId = await this._addPost(userId)
      if (!postId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const postContentId = await this._addPostContent(postContent, postId)
      if (!postContentId) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const postHistory = await this._addHistory(postId, userId, postContent)
      if (!postHistory) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      // Immediately return if there is no tags to be added.
      if (!postContent.tags) {
        return {
          statusCode: HTTP_STATUS.CREATED.code,
          message: HTTP_STATUS.CREATED.message,
        }
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
   * @param {string} postId
   * @returns {string}
   */
  private readonly _addPostContent = async (
    postContent: AddPostDTO,
    postId: string
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const postContentId = await this._postsRepository.addPostContent(
        postContent,
        id,
        postId,
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
   * @returns {string}
   */
  private readonly _addPost = async (
    userId: string,
  ): Promise<string | undefined> => {
    try {
      const id = generateId()
      const response = await this._postsRepository.addPost(
        id,
        userId,
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

        // Insert tag if there's no tag with that name
        if (!tagResponse) {
          const tagId = generateId()
          const insertTagResponse = await this._tagsRepository.add(tagId, tag)
          if (!insertTagResponse)
            throw new Error(HTTP_STATUS.INTERNAL_SERVER_ERROR.message)

          tagIds.push(tagId)
        } else {
          // Gets the tag's id if it already existed.
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

  private readonly _addHistory = async (
    postId: string,
    userId: string,
    payload: AddPostDTO | EditPostDTO,
  ): Promise<boolean | undefined> => {
    const { title, coverImageUrl, body, images } = payload
    const imageList = JSON.stringify(images)
    const historyId = generateId()
    try {
      const queryBuilder = new InsertBuilder()
        .from("post_history")
        .set("id", historyId)
        .set("post_id", postId)
        .set("user_id", userId)
        .set("title", title)
        .set("body", body)
      if (coverImageUrl) queryBuilder.set("cover_image_url", coverImageUrl)
      if (images) queryBuilder.set("images", imageList)

      const { query, values } = queryBuilder.build()
      const response = await this._postsRepository.addHistory(query, values)
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

      // Gets the ID of the user who made the final edit and updates the post table.
      const isSameUser: string = postData.user_id
      if (userId !== isSameUser) {
        const updatedUser = await this._postsRepository.updatedUser(userId)
        if (!updatedUser) {
          return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
          }
        }
      }

      // Adding the the new edit to history.
      const postHistory = await this._addHistory(postId, userId, { title, coverImageUrl, body, images })
      if (!postHistory) {
        return {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
        }
      }

      const queryBuilder = new UpdateBuilder()
        .from("post_contents")
        .set("title", title)
        .set("body", body)
      if (coverImageUrl) queryBuilder.set("cover_image_url", coverImageUrl)
      if (images) queryBuilder.set("images", imageList)
      queryBuilder.where("post_id", "=", postId)

      const { query, values } = queryBuilder.build()
      const response = await this._postsRepository.edit(query, values)
      switch (response) {
        case true:
          return {
            statusCode: HTTP_STATUS.OK.code,
            message: HTTP_STATUS.OK.message,
          }

        case false:
          return {
            statusCode: HTTP_STATUS.NOT_MODIFIED.code,
            message: HTTP_STATUS.NOT_MODIFIED.message,
          }

        default:
          return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
          }
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
    try {
      const existingTags = await this._tagsRepository.getPostTags(postId)

      // If the post has no tag, immediately inserts them.
      if (!existingTags) {
        const addTagResponse = await this._addPostTags(postId, tags)

        if (addTagResponse) {
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

      const response = await this._updateTags(postId, existingTags, tags)
      switch (response) {
        case 204:
          return {
            statusCode: HTTP_STATUS.NOT_MODIFIED.code,
            message: HTTP_STATUS.NOT_MODIFIED.message,
          }

        case 200:
          return {
            statusCode: HTTP_STATUS.OK.code,
            message: HTTP_STATUS.OK.message,
          }

        default:
          return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
          }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      throw error
    }
  }

  /**
   * Inserts new tags and deletes old ones.
   * @param {string} postId ID of the post.
   * @param {string[]} existingTags tags that already existed in the database.
   * @param {string[]} newTags tags that have not existed in the database.
   * @returns {Promise<number | undefined>} based on the HTTP status code. 200 for success, 204 for nothing to be updated, 500 and undefined for failed operations.
   */
  private readonly _updateTags = async (
    postId: string,
    existingTags: string[],
    newTags: string[],
  ): Promise<number | undefined> => {
    // Filters out the tags to be inserted/deleted.
    const toInsert = newTags.filter((item) => !existingTags.includes(item)) // If it's not in existingTags, keep it.
    const toDelete = existingTags.filter((item) => !newTags.includes(item))

    if (!toInsert.length && !toDelete.length) {
      return HTTP_STATUS.NO_CONTENT.code
    }

    let response: boolean | undefined
    if (toInsert.length) {
      response = await this._addPostTags(postId, toInsert)
      if (!response) return HTTP_STATUS.INTERNAL_SERVER_ERROR.code
    }

    if (toDelete.length) {
      response = await this._deletePostTags(postId, toDelete)
      if (!response) return HTTP_STATUS.INTERNAL_SERVER_ERROR.code
    }

    return HTTP_STATUS.OK.code
  }

  private readonly _deletePostTags = async (
    postId: string,
    tags: string[],
  ): Promise<boolean | undefined> => {
    try {
      let response: boolean | undefined
      for (const tag of tags) {
        // Gets the tag ID since it's currently an array of tag names.
        const tagResponse = await this._tagsRepository.findByName(tag)
        if (!tagResponse) return

        response = await this._postsRepository.deletePostTags(
          tagResponse.id,
          postId,
        )
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

  public delete = async (id: string): Promise<BaseResponse | undefined> => {
    try {
      const response = await this._postsRepository.delete(id)
      switch (response) {
        case 1:
          return {
            statusCode: HTTP_STATUS.OK.code,
            message: HTTP_STATUS.OK.message,
          }

        case 0:
          return {
            statusCode: HTTP_STATUS.NOT_MODIFIED.code,
            message: HTTP_STATUS.NOT_MODIFIED.message,
          }

        default:
          return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
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
