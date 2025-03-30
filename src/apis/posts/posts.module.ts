import express from "express"

import PostsController from "./posts.controller"
import PostsService from "./posts.service"
import PostsValidator from "./posts.validator"
import PostsRepository from "./posts.repository"
import TagsRepository from "../tags/tags.repository"
import type { Logger } from "~/miscs/logger"

export default function PostsModule(logger: Logger) {
  const postsRepository = new PostsRepository(logger)
  const tagsRepository = new TagsRepository()
  const postsService = new PostsService(logger, postsRepository, tagsRepository)
  const postsValidator = new PostsValidator()
  const postsController = new PostsController(postsService, postsValidator)


  const router = express.Router()

  router.get("/", postsController.getAll)
  router.post("/", postsController.add)
  router.put("/")
  router.delete("/")
  router.get("/:id", postsController.get)

  return router
}
