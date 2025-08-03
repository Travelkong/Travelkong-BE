import { Router } from "express"

import { JwtMiddleware } from "~/middlewares"
import LikesController from "./likes.controller"

const router: Router = Router()

// Get all likes from a user
router.get("/", JwtMiddleware.verifyAccessToken, LikesController.getAll)
router.get("/post/:id", LikesController.getPostLikes)
router.get("/comment/:id", LikesController.getCommentLikes)
router.get("/post/:id/liked", JwtMiddleware.verifyAccessToken, LikesController.isPostLiked)
router.get("/comment/:id/liked", JwtMiddleware.verifyAccessToken, LikesController.isCommentLiked)
router.post("/post", JwtMiddleware.verifyAccessToken, LikesController.addPostLike)
router.post("/comment", JwtMiddleware.verifyAccessToken, LikesController.addCommentLike)
router.delete("/post", JwtMiddleware.verifyAccessToken, LikesController.removePostLike)
router.delete("/comment", JwtMiddleware.verifyAccessToken, LikesController.removeCommentLike)

export default router