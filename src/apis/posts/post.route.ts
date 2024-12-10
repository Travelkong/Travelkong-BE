import express from "express"
import { Create } from "./post"

const router = express.Router()

router.post("/create", Create)
router.put("/edit", )
router.delete("/delete", )

export default router