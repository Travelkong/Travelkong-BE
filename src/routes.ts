import { Express } from "express"
import AuthRoute from "./apis/auth"
import PostRoute from "./apis/post"
import PostContentRoute from "./apis/postContent"
import { verifyToken } from "./middlewares"

const initRoutes = (app: Express): any => {
  app.use("/apis/auth", AuthRoute)
  app.use("/apis/post", verifyToken, PostRoute)
  app.use("/apis/postContent", verifyToken, PostContentRoute)

  // Fall back route
  return app.get(/.*/, (req, res) => {
    res.status(404).send("Server is on...")
  })
}

export default initRoutes
