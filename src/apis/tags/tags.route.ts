import { Router } from "express"

import TagsController from "./tags.controller"
import { JwtMiddleware } from "~/middlewares"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", TagsController.findByName)
router.post("/:name", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, TagsController.add)
router.put("/update", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, TagsController.update)
router.delete("/:id", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, TagsController.delete)

export default router
