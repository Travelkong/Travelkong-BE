import express from "express"

import PostsController from "./posts.controller"
import PostsService from "./posts.service"
import PostsValidator from "./posts.validator"
import PostsRepository from "./posts.repository"
import TagsRepository from "../tags/tags.repository"
import type { Logger } from "~/miscs/logger"
import { requireAdmin, verifyToken } from "~/middlewares"

export default function PostsModule(logger: Logger) {
  const postsRepository = new PostsRepository(logger)
  const tagsRepository = new TagsRepository()
  const postsService = new PostsService(logger, postsRepository, tagsRepository)
  const postsValidator = new PostsValidator()
  const postsController = new PostsController(postsService, postsValidator)

  const router = express.Router()

  router.get("/:id", postsController.get)
  router.get("/", postsController.getAll)
  router.get("/:id/history", postsController.getPostHistory)
  router.post("/", verifyToken, requireAdmin, postsController.add)
  router.put("/", verifyToken, requireAdmin, postsController.edit)
  router.put("/:id/tags", verifyToken, requireAdmin, postsController.tags)
  router.delete("/:id", verifyToken, requireAdmin, postsController.delete)

  return router
}
