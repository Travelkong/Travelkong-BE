import { Express } from "express"

import { verifyToken } from "./middlewares"

import AuthRoute from "./apis/auth"
import PostRoute from "./apis/posts"
import CommentRoute from "./apis/comments"
import UserRoute from "./apis/user"
import LikesRoute from "./apis/likes"

const initRoutes = (app: Express): any => {
  app.use("/apis/auth", AuthRoute)
  app.use("/apis/posts", verifyToken, PostRoute)
  app.use("/apis/comments", verifyToken, CommentRoute)
  app.use("/apis/likes", verifyToken, LikesRoute)
  app.use("/apis/user", verifyToken, UserRoute)

  // Fall back route
  return app.get(/.*/, (req, res) => {
    res.status(404).send("No such route was found...")
  })
}

export default initRoutes
