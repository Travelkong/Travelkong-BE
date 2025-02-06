import { Router } from "express";

import commentsController from "./comments.controller";

const router = Router()

router.get("/:id", commentsController.get)
router.post("/create", commentsController.add)
router.put("/:id", commentsController.edit)
router.delete("/:id", commentsController.delete)

export default router