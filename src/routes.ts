import type { Express } from "express"
import swaggerUi from "swagger-ui-express"

import swaggerDocs from "./configs/swagger.config"
import AuthModule from "./apis/auth"
import PostModule from "./apis/posts/posts.module"
import CommentRoute from "./apis/comments"
import UserRoute from "./apis/user"
import LikesRoute from "./apis/likes"
import TagsRoute from "./apis/tags"
import SearchModule from "./apis/search/search.module"

import JwtService from "./@core/services/jwt"
import postgresqlConnection  from '~/configs/postgresql.config';

import { Logger } from "./miscs/logger"

export type ServiceContext = {
  jwtService: JwtService
  loggerService: Logger
  postgresqlService: typeof postgresqlConnection
}

const serviceContext: ServiceContext = {
  jwtService: new JwtService(),
  loggerService: new Logger(),
  postgresqlService: postgresqlConnection
}

const initRoutes = (app: Express): Express => {
  app.use("/apis/auth", AuthModule(serviceContext))
  app.use("/apis/posts", PostModule(serviceContext))
  app.use("/apis/search", SearchModule(serviceContext))
  app.use("/apis/comments", CommentRoute)
  app.use("/apis/user", UserRoute)
  app.use("/apis/likes", LikesRoute)
  app.use("/apis/tags", TagsRoute)

  // API documentation
  app.use(
    "/apis/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true }),
  )

  // Fall back route
  return app.get(/.*/, (req, res) => {
    res.status(404).send("No such route was found...")
  })
}

export default initRoutes
