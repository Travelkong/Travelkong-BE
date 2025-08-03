import { JwtMiddleware } from '~/middlewares';
import { Router } from "express";

import commentsController from "./comments.controller";

const router = Router()

router.get("/:id", commentsController.get)
router.post("/", JwtMiddleware.verifyAccessToken, commentsController.add)
router.put("/:id", JwtMiddleware.verifyAccessToken, commentsController.edit)
router.delete("/:id", JwtMiddleware.verifyAccessToken, commentsController.delete)

export default router