import { Express } from "express"
import AuthRoute from "./apis/auth"
import PostRoute from "./apis/post"

const initRoutes = (app: Express): any => {
    app.use("/apis/auth", AuthRoute)
    app.use("/apis/post", PostRoute)

    // Fall back route
    return app.get(/.*/, (req, res) => {
        res.status(404).send("Server is on...")
    })
}

export default initRoutes