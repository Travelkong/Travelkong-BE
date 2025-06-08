import { Router } from "express"

import { JwtMiddleware } from "~/middlewares"
import LikesController from "./likes.controller"

const router: Router = Router()

// Get all likes from a user
router.get("/getAll", JwtMiddleware.verifyAccessToken, LikesController.getAll)
router.get("/post/:id", LikesController.getPostLikes)
router.get("/comment/:id", LikesController.getCommentLikes)
router.get("/post/:id/liked", JwtMiddleware.verifyAccessToken, LikesController.isPostLiked)
router.get("/comment/:id/liked", JwtMiddleware.verifyAccessToken, LikesController.isCommentLiked)
router.post("/addPost", JwtMiddleware.verifyAccessToken, LikesController.addPostLike)
router.post("/addComment", JwtMiddleware.verifyAccessToken, LikesController.addCommentLike)
router.delete("/removePost", JwtMiddleware.verifyAccessToken, LikesController.removePostLike)
router.delete("/removeComment", JwtMiddleware.verifyAccessToken, LikesController.removeCommentLike)

export default router