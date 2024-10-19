import { Express } from "express"
import AuthRoute from "./apis/auth"

const initRoutes = (app: Express): any => {
    app.use("/apis/auth", AuthRoute)

    // Fall back route
    return app.get(/.*/, (req, res) => {
        res.status(404).send("Server is on...")
    })
}

export default initRoutes