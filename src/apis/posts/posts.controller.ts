import type { Response, NextFunction } from "express"

import PostsService from "./posts.service"
import PostsValidator from "./posts.validator"
import { isAdmin, type AuthenticatedRequest } from "~/middlewares"
import type { PostContentModel } from "./postContent.model"
import type { AddPostDTO } from "./interfaces/postContent.dto"

class PostsController {
  readonly #postsService: PostsService
  readonly #postsValidator: PostsValidator

  constructor() {
    this.#postsService = new PostsService()
    this.#postsValidator = new PostsValidator()
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {}

  public getAll = async () => {}

  public add = async (
    req: AuthenticatedRequest & { body: AddPostDTO },
    res: Response,
    next: NextFunction,
  ) => {
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
      if (response) {
        return res
          .status(response.statusCode)
          .json({ message: response.message })
      }
    } catch (error) {
      next(error)
    }
  }

  public edit = async () => {}

  public delete = async () => {}
}

export default new PostsController()
