import type { Request, Response, NextFunction } from "express"

import type PostsService from "./posts.service"
import type PostsValidator from "./posts.validator"
import type { AuthenticatedRequest } from "~/middlewares"
import type { PostsRequest } from "./interfaces/posts.interface"
import type {
  AddPostDTO,
  EditPostDTO,
  EditPostTagsDTO,
} from "./interfaces/postContent.dto"
import { HTTP_STATUS } from "~/miscs/utils"

export default class PostsController {
  constructor(
    private readonly _postsService: PostsService,
    private readonly _postsValidator: PostsValidator,
  ) {}

  public get = async (
    req: { body: PostsRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const validationError = this._postsValidator.validateId(payload)
      if (validationError) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const response = await this._postsService.get(payload)
      if (response)
        return res
          .status(response?.statusCode)
          .json({ message: response?.message, data: response?.data })
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const response = await this._postsService.getAll()
      if (response) {
        return res.status(response.statusCode).json({
          message: response.message,
          data: response.data,
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public getPostHistory = async (
    req: { body: PostsRequest },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body?.id
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const validationError = this._postsValidator.validateId(payload)
      if (validationError) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const response = await this._postsService.getPostHistory(payload)
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message, data: response.data })
      }
    } catch (error) {
      next(error)
    }
  }

  public add = async (
    req: AuthenticatedRequest & { body: AddPostDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const postContent: AddPostDTO | undefined = req.body
      if (!postContent) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED.code)
          .json({ message: HTTP_STATUS.UNAUTHORIZED.message })
      }

      const validationError =
        this._postsValidator.validatePostContent(postContent)
      if (validationError) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const response = await this._postsService.add(userId, postContent)
      if (response)
        return res
          .status(response.statusCode)
          .json({ message: response.message })
    } catch (error) {
      next(error)
    }
  }

  public edit = async (
    req: AuthenticatedRequest & { body: EditPostDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload: EditPostDTO = req.body
      const userId = req.user?.userId
      if (!payload || !userId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const validationError = this._postsValidator.validateEditPost(payload)
      if (validationError) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const response = await this._postsService.edit(payload, userId)
      if (response)
        return res
          .status(response.statusCode)
          .json({ message: response.message })
    } catch (error) {
      next(error)
    }
  }

  // Had to separate this from the edit post API because it was getting way too complicated.
  public editPostTags = async (
    req: { body: EditPostTagsDTO },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body
      if (!payload) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const validationError = this._postsValidator.validateTags(payload)
      if (validationError) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: validationError })
      }

      const response = await this._postsService.editPostTags(payload)
      if (response)
        return res
          .status(response.statusCode)
          .json({ message: response.message })
    } catch (error) {
      next(error)
    }
  }

  public delete = async (
    req: AuthenticatedRequest & { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body
      if (!payload) {
        return res.status(400).json({ message: "Invalid post ID." })
      }
    } catch (error) {
      next(error)
    }
  }
}
