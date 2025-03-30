import { Router } from "express"

import TagsController from "./tags.controller"
import { requireAdmin, verifyToken } from "~/middlewares"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", TagsController.findByName)
router.post("/:name", verifyToken, requireAdmin, TagsController.add)
router.put("/update", verifyToken, requireAdmin, TagsController.update)
router.delete("/:id", verifyToken, requireAdmin, TagsController.delete)

export default router
