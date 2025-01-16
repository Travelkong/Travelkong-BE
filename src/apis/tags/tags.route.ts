import { Router } from "express"

import TagsController from "./tags.controller"
import { isAdmin, verifyToken } from "~/middlewares"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", verifyToken, isAdmin, TagsController.find)

export default router
