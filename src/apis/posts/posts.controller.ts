import type { Response, NextFunction } from "express"

import PostsService from "./posts.service"
import type { AuthenticatedRequest } from "~/middlewares"
import type { PostContentModel } from "./postContent.model"
import type { PostsModel } from "./posts.model"

class PostsController {
  readonly #postsService: PostsService

  constructor() {
    this.#postsService = new PostsService()
  }

  public get = async (req: Request, res: Response, next: NextFunction) => {}

  public getAll = async () => {}

  public addPost = async (
    req: AuthenticatedRequest & { body: PostContentModel },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const postContent = req.body
      if (!postContent) {
        return res.status(400).json({ message: "Post content is required." })
      }

      
    } catch (error) {
      next(error)
    }
  }
}

export default new PostsController()
