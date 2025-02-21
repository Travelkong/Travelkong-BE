import { Router } from "express"

import { verifyToken } from "~/middlewares"

const router = Router()

router.get("/", verifyToken, )
router.post("/", verifyToken, )

export default router
