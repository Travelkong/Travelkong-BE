import { Router } from "express"

import { verifyToken } from "~/middlewares"
import LikesController from "./likes.controller"

const router: Router = Router()

router.post("/addLike", verifyToken, LikesController.getAll)

export default router