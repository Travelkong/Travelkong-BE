import express from "express"

import SearchController from "./search.controller"
import SearchService from "./search.service"
import SearchRepository from "./search.repository"
import type { Logger } from "~/miscs/logger"

export default function SearchModule(logger: Logger) {
  const searchRepository = new SearchRepository(logger)
  const searchService = new SearchService(logger, searchRepository)
  const searchController = new SearchController(searchService)

  const router = express.Router()

  router.get("/", searchController.searchPosts)

  return router
}
