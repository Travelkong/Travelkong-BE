import { Router } from "express"

import TagsController from "./tags.controller"
import { verifyToken } from "~/middlewares"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", verifyToken, TagsController.find)
router.post("/:name", verifyToken, TagsController.add)

export default router
