import { Router } from "express"
import TagsController from "./tags.controller"

const router = Router()

router.get("/getAll", TagsController.getAll)
router.get("/:name", TagsController.find)

export default router
