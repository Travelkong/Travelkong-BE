import { Router } from "express";

import { createCommentController } from './comment.controller';

const router = Router()

router.post("/create", createCommentController)

export default router