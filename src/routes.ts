import type { Express } from "express"
import swaggerUi from "swagger-ui-express"
import postgresqlConnection from "~/configs/postgresql.config"
import JwtService from "./@core/services/jwt"
import AuthModule from "./apis/auth"
import CommentsModule from "./apis/comments"
import LikesRoute from "./apis/likes"
import PostModule from "./apis/posts/posts.module"
import SearchModule from "./apis/search/search.module"
import TagsRoute from "./apis/tags"
import UserRoute from "./apis/user"
import swaggerDocs from "./configs/swagger.config"

import { Logger } from "./miscs/logger"
import { HTTP_STATUS } from "./miscs/utils"

export type ServiceContext = {
  jwtService: JwtService
  loggerService: Logger
  postgresqlService: typeof postgresqlConnection
}

const serviceContext: ServiceContext = {
  jwtService: new JwtService(),
  loggerService: new Logger(),
  postgresqlService: postgresqlConnection,
}

const initRoutes = (app: Express): Express => {
  const comment = CommentsModule(serviceContext)

  app.use("/apis/auth", AuthModule(serviceContext))
  app.use("/apis/posts", PostModule(serviceContext))
  app.use("/apis/search", SearchModule(serviceContext))
  app.use("/apis/user", UserRoute)
  app.use("/apis/likes", LikesRoute)
  app.use("/apis/tags", TagsRoute)

  app.use("/apis/comments", comment.rootRouter)
  app.use("/apis", comment.relatedRouter)

  // API documentation
  app.use(
    "/apis/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true }),
  )

  // Meta
  app.use("/", (req, res) => {
    res.send("Hello, World!")
  })

  // Fall back route
  return app.get(/.*/, (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND.code).send("No such route was found...")
  })
}

export default initRoutes
