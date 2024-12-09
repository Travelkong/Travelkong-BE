import { Express } from "express"

import { verifyToken } from "./middlewares"

import AuthRoute from "./apis/auth"
import PostRoute from "./apis/post"
import CommentRoute from "./apis/comment"
import UserRoute from "./apis/user"

const initRoutes = (app: Express): any => {
  app.use("/apis/auth", AuthRoute)
  app.use("/apis/post", verifyToken, PostRoute)
  app.use("/apis/comment", verifyToken, CommentRoute)
  app.use("/apis/user", verifyToken, UserRoute)

  // Fall back route
  return app.get(/.*/, (req, res) => {
    res.status(404).send("No such route was found...")
  })
}

export default initRoutes
