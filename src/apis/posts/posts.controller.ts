import { HTTP_STATUS } from './../../miscs/utils/httpStatus';
import type { Response, NextFunction } from "express"

import PostsService from "./posts.service"
import PostsValidator from "./posts.validator"
import { isAdmin, type AuthenticatedRequest } from "~/middlewares"
import type { AddPostDTO, EditPostDTO } from "./interfaces/postContent.dto"
import { HTTP_STATUS } from "~/miscs/utils"

class PostsController {
  readonly #postsService: PostsService
  readonly #postsValidator: PostsValidator

  constructor() {
    this.#postsService = new PostsService()
    this.#postsValidator = new PostsValidator()
  }

  public get = async (
    req: { body: string },
    res: Response,
    next: NextFunction,
  ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
    try {
      const payload = req.body
      if (!payload) {
        return res.status(400).json({ message: "Invalid post ID." })
      }

      const validationError = this.#postsValidator.validateId(payload)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#postsService.get(payload)
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
      const response = await this.#postsService.getAll()
      if (response)
        return res
          .status(response.statusCode)
          .json({ message: response.message, data: response.data })
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
        return res.status(400).json({ message: "Post content is required." })
      }

      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: "No user ID provided." })
      }

      const checksAdmin = await isAdmin(userId)
      if (!checksAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized for this action." })
      }

      const validationError =
        this.#postsValidator.validatePostContent(postContent)
      if (validationError) {
        return res.status(400).json({ message: validationError })
      }

      const response = await this.#postsService.addPost(userId, postContent)
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
      const payload = req.body
      const userId = req.user?.userId
      if (!payload || !userId) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: HTTP_STATUS.BAD_REQUEST.message })
      }

      const validationError = this.#postsValidator.validateEditPost(payload)
      if (validationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: validationError })
      }

      
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

export default new PostsController()
