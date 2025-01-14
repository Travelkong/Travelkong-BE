import { Router } from "express"
import { verifyToken } from "~/middlewares"

const router = Router()

router.get("/getAll", verifyToken, )
router.get("/:name", verifyToken, )

export default router