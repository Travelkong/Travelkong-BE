import { Router } from "express"

import TagsController from "./tags.controller"
import { verifyToken } from "~/middlewares"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", TagsController.find)
router.post("/:name", verifyToken, TagsController.add)
router.put("/update", verifyToken, TagsController.update)
router.delete("/:id", verifyToken, TagsController.delete)

export default router
