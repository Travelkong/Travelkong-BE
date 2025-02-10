import { verifyToken } from './../../middlewares/jwt';
import { Router } from "express";

import commentsController from "./comments.controller";

const router = Router()

router.get("/:id", commentsController.get)
router.post("/create", verifyToken, commentsController.add)
router.put("/:id", verifyToken, commentsController.edit)
router.delete("/:id", verifyToken, commentsController.delete)

export default router