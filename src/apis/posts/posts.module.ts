import express from "express"

import PostsController from "./posts.controller"
import PostsService from "./posts.service"
import PostsValidator from "./posts.validator"
import PostsRepository from "./posts.repository"
import TagsRepository from "../tags/tags.repository"
import { JwtMiddleware } from "~/middlewares"
import { ServiceContext } from "~/routes"

export default function PostsModule(serviceContext: ServiceContext) {
  const postsRepository = new PostsRepository(serviceContext.loggerService)
  const tagsRepository = new TagsRepository()
  const postsService = new PostsService(serviceContext.loggerService, postsRepository, tagsRepository)
  const postsValidator = new PostsValidator()
  const postsController = new PostsController(postsService, postsValidator)

  const router = express.Router()

  router.get("/:id", postsController.get)
  router.get("/", postsController.getAll)
  router.get("/:id/history", postsController.getPostHistory)
  router.post("/", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, postsController.add)
  router.put("/", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, postsController.edit)
  router.put("/:id/tags", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, postsController.tags)
  router.delete("/:id", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, postsController.delete)

  return router
}
