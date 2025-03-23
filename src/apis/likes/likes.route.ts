import { Router } from "express"

import { verifyToken } from "~/middlewares"
import LikesController from "./likes.controller"

const router: Router = Router()

// Get all likes from a user
router.get("/getAll", verifyToken, LikesController.getAll)
router.get("/post/:id", LikesController.getPostLikes)
router.get("/comment/:id", LikesController.getCommentLikes)
router.get("/post/:id/liked", verifyToken, LikesController.isPostLiked)
router.get("/comment/:id/liked", verifyToken, LikesController.isCommentLiked)
router.post("/addPost", verifyToken, LikesController.addPostLike)
router.post("/addComment", verifyToken, LikesController.addCommentLike)
router.delete("/removePost", verifyToken, LikesController.removePostLike)
router.delete("/removeComment", verifyToken, LikesController.removeCommentLike)

export default router