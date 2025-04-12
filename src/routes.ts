import type { Express } from "express"
import swaggerUi from "swagger-ui-express"

import { verifyToken } from "./middlewares"

import swaggerDocs from "./configs/swagger.config"
import AuthRoute from "./apis/auth"
import PostModule from "./apis/posts/posts.module"
import CommentRoute from "./apis/comments"
import UserRoute from "./apis/user"
import LikesRoute from "./apis/likes"
import TagsRoute from "./apis/tags"
import { Logger } from "./miscs/logger"
const logger = new Logger()

const initRoutes = (app: Express): Express => {
  app.use("/apis/auth", AuthRoute)
  app.use("/apis/posts", PostModule(logger))
  app.use("/apis/comments", CommentRoute)
  app.use("/apis/user", verifyToken, UserRoute)
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
