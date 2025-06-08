import express from "express"

import SearchController from "./search.controller"
import SearchService from "./search.service"
import SearchRepository from "./search.repository"
import { ServiceContext } from "~/routes"

export default function SearchModule(serviceContext: ServiceContext) {
  const searchRepository = new SearchRepository(serviceContext.loggerService)
  const searchService = new SearchService(serviceContext.loggerService, searchRepository)
  const searchController = new SearchController(searchService)

  const router = express.Router()

  router.get("/", searchController.searchPosts)

  return router
}
