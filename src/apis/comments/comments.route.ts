import { Router } from "express";

import commentController from "./comments.controller";

const router = Router()

router.get("/:id", commentController.get)
router.post("/create", commentController.add)
router.put("/:id", )
router.delete("/:id", )

export default router