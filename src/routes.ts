import type { Express } from "express"
import swaggerUi from "swagger-ui-express"

import { verifyToken } from "./middlewares"

import swaggerDocs from "./configs/swagger.config"
import AuthRoute from "./apis/auth"
import PostRoute from "./apis/posts"
import CommentRoute from "./apis/comments"
import UserRoute from "./apis/user"
import LikesRoute from "./apis/likes"
import TagsRoute from "./apis/tags"


const initRoutes = (app: Express): Express => {
  app.use("/apis/auth", AuthRoute)
  app.use("/apis/posts", verifyToken, PostRoute)
  app.use("/apis/comments", verifyToken, CommentRoute)
  app.use("/apis/user", verifyToken, UserRoute)
  app.use("/apis/likes", verifyToken, LikesRoute)
  // Not all endpoints require passing through a JWT token.
  // TODO: Fix this!!!
  app.use("/apis/tags", verifyToken, TagsRoute)

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
