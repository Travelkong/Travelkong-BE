import express from "express"
import { Create } from "./posts"

const router = express.Router()

router.post("/create", Create)
router.put("/edit", )
router.delete("/delete", )

export default router