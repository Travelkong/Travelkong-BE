import { Router } from "express"

import { verifyToken } from "~/middlewares"
import LikesController from "./likes.controller"

const router: Router = Router()

// Get all likes from a user
router.get("/getAll", verifyToken, LikesController.getAll)
router.post("/addPost", verifyToken, LikesController.addPostLike)
router.post("/addComment", verifyToken, LikesController.addCommentLike)

export default router